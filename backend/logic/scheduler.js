const generateSchedule = (subjects) => {
  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const times = [
    '09:00-10:00',
    '10:00-11:00',
    '11:00-12:00',
    '14:00-15:00',
    '15:00-16:00',
    '16:00-17:00',
  ];

  const schedule = [];
  let subjectIndex = 0;

  times.forEach((time) => {
    days.forEach((day) => {
      if (subjectIndex < subjects.length) {
        schedule.push({
          day,
          time,
          subject: subjects[subjectIndex].name,
          duration: 60,
        });
        subjectIndex = (subjectIndex + 1) % subjects.length;
      }
    });
  });

  return schedule;
};

const optimizeSchedule = (subjects, userSettings) => {
  // AI logic to optimize schedule based on user settings
  const studyDuration = userSettings.studyDuration || 50;
  const breakDuration = userSettings.breakDuration || 10;
  
  // Sort subjects by difficulty
  const sortedSubjects = subjects.sort((a, b) => {
    const difficultyMap = { easy: 1, medium: 2, hard: 3 };
    return difficultyMap[b.difficulty] - difficultyMap[a.difficulty];
  });

  return generateSchedule(sortedSubjects);
};

module.exports = {
  generateSchedule,
  optimizeSchedule,
};
