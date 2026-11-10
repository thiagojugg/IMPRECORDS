(() => {
  const zone = "America/Sao_Paulo";
  const updateChristmasSeason = () => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: zone, month: "numeric", day: "numeric", hour: "numeric", hourCycle: "h23"
    }).formatToParts(new Date());
    const month = Number(parts.find(part => part.type === "month")?.value);
    const day = Number(parts.find(part => part.type === "day")?.value);
    const hour = Number(parts.find(part => part.type === "hour")?.value);
    const afterStart = month > 11 || (month === 11 && (day > 25 || (day === 25 && hour >= 12)));
    const beforeEnd = month === 1 && day === 1 && hour < 12;
    document.documentElement.classList.toggle("imp-christmas-season-active", afterStart || beforeEnd);
  };
  updateChristmasSeason();
  window.setInterval(updateChristmasSeason, 15000);
  document.addEventListener("visibilitychange", () => {
    if (!document.hidden) updateChristmasSeason();
  });
})();