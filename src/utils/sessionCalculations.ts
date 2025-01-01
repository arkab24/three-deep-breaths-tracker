import { startOfMonth, endOfMonth, eachWeekOfInterval, startOfWeek, endOfWeek } from "date-fns";

export const getUniqueDaysForMonth = (sessions: any[], month: Date) => {
  const uniqueDays = new Set();
  console.log(`Checking sessions for month: ${month.toISOString()}`);
  console.log('All sessions:', sessions);
  
  sessions?.forEach(session => {
    const sessionDate = new Date(session.completed_at);
    console.log(`Comparing session date: ${sessionDate.toISOString()} with month: ${month.getMonth()}`);
    
    if (
      sessionDate.getMonth() === month.getMonth() &&
      sessionDate.getFullYear() === month.getFullYear()
    ) {
      console.log(`Found matching session for ${month.toLocaleString('default', { month: 'long' })}: ${sessionDate.getDate()}`);
      uniqueDays.add(sessionDate.getDate());
    }
  });
  
  console.log(`Unique days for ${month.toLocaleString('default', { month: 'long' })}: ${uniqueDays.size}`);
  return uniqueDays.size;
};

export const getTotalSessionsForMonth = (sessions: any[], month: Date) => {
  return sessions?.filter(session => {
    const sessionDate = new Date(session.completed_at);
    return (
      sessionDate.getMonth() === month.getMonth() &&
      sessionDate.getFullYear() === month.getFullYear()
    );
  }).length || 0;
};

export const getPerfectWeeksForMonth = (sessions: any[], month: Date) => {
  const monthStart = startOfMonth(month);
  const monthEnd = endOfMonth(month);
  const weeks = eachWeekOfInterval({ start: monthStart, end: monthEnd });
  
  let perfectWeeks = 0;
  weeks.forEach(weekStart => {
    const weekEnd = endOfWeek(weekStart);
    const hasSessionEveryDay = Array.from({ length: 7 }).every((_, index) => {
      const currentDate = new Date(weekStart);
      currentDate.setDate(currentDate.getDate() + index);
      
      if (currentDate.getMonth() !== month.getMonth()) return true;
      
      return sessions?.some(session => {
        const sessionDate = new Date(session.completed_at);
        return (
          sessionDate.getDate() === currentDate.getDate() &&
          sessionDate.getMonth() === currentDate.getMonth() &&
          sessionDate.getFullYear() === currentDate.getFullYear()
        );
      });
    });
    
    if (hasSessionEveryDay) perfectWeeks++;
  });
  
  return perfectWeeks;
};

export const getTotalUniqueDays = (sessions: any[]) => {
  return new Set(
    sessions?.map(session => {
      const date = new Date(session.completed_at);
      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    })
  ).size;
};