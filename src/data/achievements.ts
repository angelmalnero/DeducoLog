import { Achievement, UserStats } from '../types/logic';

export interface AchievementDef {
  id: string;
  title: string;
  description: string;
  category: 'progress' | 'streak' | 'mastery' | 'speed';
  icon: string;
  xpReward: number;
  conditionDescription: string;
  maxProgress: number;
  getProgress: (stats: UserStats) => number;
}

export const ACHIEVEMENTS_DEFINITIONS: AchievementDef[] = [
  {
    id: 'first_step',
    title: 'Primer Paso Deductivo',
    description: 'Completa tu primera lección formal en la ruta de aprendizaje.',
    category: 'progress',
    icon: 'compass',
    xpReward: 30,
    conditionDescription: 'Completar 1 lección',
    maxProgress: 1,
    getProgress: (s) => (s.completedLessonIds.length >= 1 ? 1 : 0),
  },
  {
    id: 'conjunction_master',
    title: 'Maestro de la Conjunción',
    description: 'Completa todas las lecciones del Módulo 1 y su desafío.',
    category: 'mastery',
    icon: 'layers',
    xpReward: 50,
    conditionDescription: 'Superar Módulo 1',
    maxProgress: 1,
    getProgress: (s) => (s.completedBossModuleIds.includes('module_1') ? 1 : 0),
  },
  {
    id: 'implication_expert',
    title: 'Experto en Implicación',
    description: 'Domina las cajas de Fitch y el Modus Ponens en el Módulo 2.',
    category: 'mastery',
    icon: 'arrow-right',
    xpReward: 60,
    conditionDescription: 'Superar Módulo 2 con Corona',
    maxProgress: 1,
    getProgress: (s) => (s.completedBossModuleIds.includes('module_2') ? 1 : 0),
  },
  {
    id: 'case_master',
    title: 'Domador de Disyunciones',
    description: 'Vence el miedo a la prueba por casos (E∨) en el Módulo 3.',
    category: 'mastery',
    icon: 'split',
    xpReward: 70,
    conditionDescription: 'Superar Módulo 3 con Corona',
    maxProgress: 1,
    getProgress: (s) => (s.completedBossModuleIds.includes('module_3') ? 1 : 0),
  },
  {
    id: 'absurd_hunter',
    title: 'Cazador del Absurdo',
    description: 'Domina la Reducción al Absurdo y el principio de contradicción.',
    category: 'mastery',
    icon: 'shield-alert',
    xpReward: 80,
    conditionDescription: 'Superar Módulo 4 con Corona',
    maxProgress: 1,
    getProgress: (s) => (s.completedBossModuleIds.includes('module_4') ? 1 : 0),
  },
  {
    id: 'streak_3',
    title: 'Constancia de Bronce',
    description: 'Mantén una racha de estudio de al menos 3 días consecutivos.',
    category: 'streak',
    icon: 'flame',
    xpReward: 40,
    conditionDescription: 'Racha de 3 días',
    maxProgress: 3,
    getProgress: (s) => Math.min(3, s.streakDays),
  },
  {
    id: 'streak_7',
    title: 'Racha Legendaria UOC',
    description: 'Estudia deducción natural durante 7 días seguidos.',
    category: 'streak',
    icon: 'zap',
    xpReward: 100,
    conditionDescription: 'Racha de 7 días',
    maxProgress: 7,
    getProgress: (s) => Math.min(7, s.streakDays),
  },
  {
    id: 'speed_demon',
    title: 'Velocista de la Lógica',
    description: 'Alcanza al menos 100 puntos en el Desafío Relámpago de 60s.',
    category: 'speed',
    icon: 'timer',
    xpReward: 50,
    conditionDescription: '100 pts en Desafío 60s',
    maxProgress: 100,
    getProgress: (s) => Math.min(100, s.highScoreSpeedDrill),
  },
  {
    id: 'speed_god',
    title: 'Reflejos de Matrícula',
    description: 'Consigue 250 puntos o más en el Desafío 60s.',
    category: 'speed',
    icon: 'award',
    xpReward: 150,
    conditionDescription: '250 pts en Desafío 60s',
    maxProgress: 250,
    getProgress: (s) => Math.min(250, s.highScoreSpeedDrill),
  },
  {
    id: 'gym_first',
    title: 'Iniciación al Examen',
    description: 'Completa con éxito tu primera deducción real en el Gimnasio UOC.',
    category: 'progress',
    icon: 'dumbbell',
    xpReward: 40,
    conditionDescription: 'Completar 1 ejercicio de examen',
    maxProgress: 1,
    getProgress: (s) => {
      try {
        const raw = localStorage.getItem('deducolog_uoc_gym_saves_v2');
        if (raw) {
          const parsed = JSON.parse(raw);
          const count = Object.values(parsed).filter((e: any) => e.isCompleted).length;
          return count >= 1 ? 1 : 0;
        }
      } catch {}
      return 0;
    },
  },
  {
    id: 'gym_half',
    title: 'Candidato a Graduado',
    description: 'Resuelve al menos 5 ejercicios reales de exámenes en el Gimnasio.',
    category: 'progress',
    icon: 'book-open',
    xpReward: 90,
    conditionDescription: 'Completar 5 ejercicios de examen',
    maxProgress: 5,
    getProgress: (s) => {
      try {
        const raw = localStorage.getItem('deducolog_uoc_gym_saves_v2');
        if (raw) {
          const parsed = JSON.parse(raw);
          const count = Object.values(parsed).filter((e: any) => e.isCompleted).length;
          return Math.min(5, count);
        }
      } catch {}
      return 0;
    },
  },
  {
    id: 'free_10',
    title: 'Práctica a Mano (10)',
    description: 'Resuelve 10 ejercicios paso a paso en el Modo Libre con Teclado.',
    category: 'progress',
    icon: 'pencil',
    xpReward: 50,
    conditionDescription: '10 ejercicios Modo Libre',
    maxProgress: 10,
    getProgress: (s) => Math.min(10, s.completedFreeExerciseIds?.length || 0),
  },
  {
    id: 'free_25',
    title: 'Dedicatoria de Notable (25)',
    description: 'Resuelve 25 ejercicios en el Modo Libre.',
    category: 'progress',
    icon: 'sparkles',
    xpReward: 100,
    conditionDescription: '25 ejercicios Modo Libre',
    maxProgress: 25,
    getProgress: (s) => Math.min(25, s.completedFreeExerciseIds?.length || 0),
  },
  {
    id: 'free_50',
    title: 'Medio Centenar Formal (50)',
    description: 'Resuelve 50 ejercicios en el Modo Libre paso a paso.',
    category: 'mastery',
    icon: 'crown',
    xpReward: 200,
    conditionDescription: '50 ejercicios Modo Libre',
    maxProgress: 50,
    getProgress: (s) => Math.min(50, s.completedFreeExerciseIds?.length || 0),
  },
  {
    id: 'free_100',
    title: 'Centurión de la Deducción (100)',
    description: '¡Hazaña legendaria! Resuelve los 100 ejercicios del Modo Libre.',
    category: 'mastery',
    icon: 'trophy',
    xpReward: 500,
    conditionDescription: 'Completar 100 ejercicios',
    maxProgress: 100,
    getProgress: (s) => Math.min(100, s.completedFreeExerciseIds?.length || 0),
  },
  {
    id: 'chest_collector',
    title: 'Cazador de Tesoros',
    description: 'Abre 3 o más cofres sorpresa en la ruta de aprendizaje.',
    category: 'progress',
    icon: 'gift',
    xpReward: 60,
    conditionDescription: 'Abrir 3 cofres',
    maxProgress: 3,
    getProgress: (s) => Math.min(3, s.openedChests?.length || 0),
  },
  {
    id: 'uoc_honors',
    title: 'Matrícula de Honor UOC',
    description: 'Supera el Módulo 6 de Síntesis y consigue más de 500 XP.',
    category: 'mastery',
    icon: 'graduation-cap',
    xpReward: 250,
    conditionDescription: 'Módulo 6 + 500 XP',
    maxProgress: 1,
    getProgress: (s) => (s.completedBossModuleIds.includes('module_6') && s.xp >= 500 ? 1 : 0),
  },
];

export function computeAchievements(stats: UserStats): Achievement[] {
  return ACHIEVEMENTS_DEFINITIONS.map((def) => {
    const progress = def.getProgress(stats);
    const isUnlocked = progress >= def.maxProgress || stats.unlockedAchievementIds?.includes(def.id);
    return {
      id: def.id,
      title: def.title,
      description: def.description,
      category: def.category,
      icon: def.icon,
      xpReward: def.xpReward,
      conditionDescription: def.conditionDescription,
      isUnlocked,
      progress,
      maxProgress: def.maxProgress,
    };
  });
}
