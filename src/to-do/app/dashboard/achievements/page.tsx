"use client";

import React, { useEffect, useState } from "react";
import {
  AchievementService,
  Badge,
  UserBadge,
} from "@/lib/services/archievementService";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { authService } from "@/lib/services/authService";
import CustomLoader from "@/components/CustomLoader";
import { Tooltip } from "@/components/ui/tooltip"; // optional if you have a tooltip component
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const AchievementsPage = () => {
  const [userBadges, setUserBadges] = useState<UserBadge[]>([]);
  const [allBadges, setAllBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);

        const [badges, userAchievements] = await Promise.all([
          AchievementService.getAllAchievements(),
          currentUser
            ? AchievementService.getUserAchievements(currentUser.id)
            : Promise.resolve([]),
        ]);

        setAllBadges(badges);
        setUserBadges(userAchievements);
      } catch (err) {
        console.error("Failed to fetch achievements:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (!user && !loading) {
    return (
      <div className="text-center py-10">
        Please log in to see your achievements.
      </div>
    );
  }

  if (loading) return <CustomLoader title="Achievements" />;

  const userBadgeIds = new Set(userBadges.map((ub) => ub.badge_id));
  const earnedMap = new Map(
    userBadges.map((ub) => [ub.badge_id, ub.earned_date])
  );

  return (
    <ProtectedRoute>
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">Archievements</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allBadges.map((badge) => {
            const earned = userBadgeIds.has(badge.id);
            const earnedDate = earnedMap.get(badge.id)?.split("T")[0];

            return (
              <Card
                key={badge.id}
                className={`flex flex-col items-center p-5 rounded-lg shadow-md transition-transform duration-200 hover:scale-105 ${
                  earned ? "opacity-100" : "opacity-40"
                }`}
              >
                {badge.icon ? (
                  <img
                    src={badge.icon}
                    alt={badge.name}
                    className="w-24 h-24 object-contain mb-4"
                  />
                ) : (
                  <div className="w-24 h-24 flex items-center justify-center bg-muted rounded-full mb-4">
                    <span className="text-xs text-muted-foreground">
                      No Icon
                    </span>
                  </div>
                )}

                <CardHeader className="p-0 mb-2 w-full flex justify-center">
                  <CardTitle className="text-lg text-center w-full">
                    {badge.name}
                  </CardTitle>
                </CardHeader>

                <CardContent className="text-center text-sm text-muted-foreground">
                  {badge.description}
                  {earnedDate && (
                    <div className="mt-1 text-xs text-muted-foreground">
                      Earned: {earnedDate}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default AchievementsPage;

