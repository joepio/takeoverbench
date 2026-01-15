export const toast = $state({
  show: false,
  message: "",
  timer: 0,
});

export function showToast(msg: string, duration: number = 5000) {
  toast.message = msg;
  toast.show = true;

  if (toast.timer) clearTimeout(toast.timer);

  toast.timer = setTimeout(() => {
    toast.show = false;
  }, duration) as unknown as number;
}

export function shareWebsite() {
  const url = typeof window !== "undefined" ? window.location.origin : "";
  if (!url) return;

  navigator.clipboard.writeText(url).then(() => {
    showToast("It's on your clipboard. Now go tell the world!");
  });
}
