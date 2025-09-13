function CustomLoader({ title }: { title?: string }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <h2 className="text-lg font-medium">Loading {title ?? ""}...</h2>
      <img
        src="https://mir-s3-cdn-cf.behance.net/project_modules/max_632/04de2e31234507.564a1d23645bf.gif"
        alt="Loading..."
        className="w-32 h-32 object-contain"
      />
    </div>
  );
}

export default CustomLoader;
