export function CanvasFallback() {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3 bg-[#FAF9F5] px-8 text-center">
      <p className="text-sm text-neutral-600">
        The 3D view couldn&apos;t load.
      </p>
      <p className="max-w-xs text-xs text-neutral-400">
        This can happen on older browsers or devices without WebGL support. Try
        refreshing, or open on a different device.
      </p>
    </div>
  );
}
