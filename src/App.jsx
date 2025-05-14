import React, { useState } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, PieChart, Pie, Cell, Tooltip } from "recharts";
import CanvasBackground from "./CanvasBackground";
import mascot from "/mascot.png";

const sections = [
  {
    title: "Зрелость процессов разработки",
    questions: [
      "Есть ли формальный процесс управления требованиями?",
      "Составляется ли подробный план проекта/итераций?",
      "Проводится ли регулярная идентификация и анализ рисков проекта?",
      "Используются ли системы контроля версий?",
      "Существует ли регламентированный процесс выпуска релизов?",
      "Автоматизированы ли процессы сборки, тестирования и развертывания?"
    ]
  },
  {
    title: "Зрелость процессов QA",
    questions: [
      "Сформулирована ли стратегия тестирования?",
      "Проводится ли планирование тестирования?",
      "Отслеживается ли прогресс тестирования?",
      "Используются ли методики дизайна тестов?",
      "Есть ли стабильная тестовая среда?",
      "Участвует ли QA в ранних этапах проекта?",
      "Проводится ли нефункциональное тестирование?",
      "Собираются ли метрики качества?",
      "Проводится ли обучение QA команды?",
      "Проводятся ли peer-review тест-кейсов?"
    ]
  },
  {
    title: "Квалификация команды тестирования",
    questions: [
      "Удалось ли избежать критичных дефектов в продакшене?",
      ">80% дефектов выявляется до релиза?",
      "Доля дефектов после релиза < 10%?",
      "Все требования покрыты тестами?",
      "Есть автоматизированное регрессионное тестирование?",
      "Время на исправление дефектов < 3 дней?",
      "Не возникает ли много регрессий?"
    ]
  },
  {
    title: "Риски проекта",
    questions: [
      "Понятны и стабильны ли требования?",
      "Сроки проекта реалистичны?",
      "Достаточно ресурсов и бюджета?",
      "Команда обладает нужной экспертизой?",
      "Используются проверенные технологии?",
      "Нет критичных внешних зависимостей?",
      "Коммуникация в команде эффективна?",
      "Учитываются ли требования по безопасности?"
    ]
  }
];


  const generateRecommendations = () => {
    const recs = [];

    // Example mappings
    const devGaps = [
      "управления требованиями",
      "планирования проекта",
      "анализа рисков",
      "контроля версий",
      "процесса релизов",
      "автоматизации CI/CD"
    ];
    const qaGaps = [
      "стратегии тестирования",
      "планирования тестирования",
      "мониторинга и отчетности",
      "методик тест-дизайна",
      "тестовой среды",
      "раннего вовлечения QA",
      "нефункционального тестирования",
      "метрик качества",
      "обучения команды QA",
      "peer-review тест-кейсов"
    ];
    const testingGaps = [
      "устранения критичных дефектов",
      "раннего обнаружения дефектов",
      "низкой утечки дефектов",
      "покрытия требований тестами",
      "автоматизации регрессионного тестирования",
      "быстрого устранения дефектов",
      "предотвращения регрессий"
    ];
    const riskAreas = [
      "неясные требования",
      "нереалистичные сроки",
      "недостаток ресурсов",
      "недостаток экспертизы",
      "новые/неизвестные технологии",
      "зависимость от внешних поставщиков",
      "проблемы коммуникации",
      "неучтенные требования по безопасности"
    ];

    const gapsBySection = [devGaps, qaGaps, testingGaps, riskAreas];

    sections.forEach((section, sIdx) => {
      section.questions.forEach((q, qIdx) => {
        const key = `${sIdx}-${qIdx}`;
        const answeredNo = answers[key] === false;
        if (answeredNo && gapsBySection[sIdx] && gapsBySection[sIdx][qIdx]) {
          recs.push(`🔸 Не хватает: ${gapsBySection[sIdx][qIdx]}. Это указывает на пробел в зрелости процесса (${section.title}).`);
        }
      });
    });

    if (recs.length === 0) {
      recs.push("✅ Все ключевые практики присутствуют. Проект демонстрирует высокий уровень зрелости.");
    }

    return recs;
  };

export default function App() {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleAnswer = (sectionIdx, qIdx, value) => {
    setAnswers({
      ...answers,
      [`${sectionIdx}-${qIdx}`]: value
    });
  };

  const handleSubmit = () => {
    setSubmitted(true);
  };

  const calculateResults = () => {
    return sections.map((section, sectionIdx) => {
      const answeredYes = section.questions.filter((_, qIdx) => answers[`${sectionIdx}-${qIdx}`]);
      return {
        name: section.title,
        value: Math.round((answeredYes.length / section.questions.length) * 100)
      };
    });
  };

  const radarData = calculateResults();
  const pieData = [
    { name: "Выполнено (Да)", value: Object.values(answers).filter(a => a).length },
    { name: "Не выполнено (Нет)", value: Object.values(answers).filter(a => !a).length }
  ];
  const COLORS = ["#34d399", "#f87171"];

  return (
    <>
      <CanvasBackground />
      <div className="relative z-10 p-4 text-white max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <img src={mascot} alt="Mascot" className="w-14 h-14 rounded-full border border-white" />
          <h1 className="text-2xl font-bold">Оценка зрелости проекта</h1>
        </div>
        {!submitted ? (
          <>
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx} className="bg-slate-800">
                <divContent className="p-4 space-y-2">
                  <h2 className="font-semibold text-lg">{section.title}</h2>
                  {section.questions.map((q, qIdx) => (
                    <div key={qIdx} className="mb-2">
                      <p>{q}</p>
                      <div className="space-x-2 mt-1">
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                          
                          onClick={() => handleAnswer(sectionIdx, qIdx, true)}>
                          Да
                        </button>
                        <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
                          
                          onClick={() => handleAnswer(sectionIdx, qIdx, false)}>
                          Нет
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            <button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4">Сформировать отчет</button>
          </>
        ) : (
          <div className="space-y-6">
            <h2 className="text-lg font-semibold">Результаты</h2>
            <div className="flex flex-wrap gap-8">
              <RadarChart cx={200} cy={200} outerRadius={150} width={400} height={400} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="name" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar name="Зрелость" dataKey="value" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
              </RadarChart>

              <PieChart width={400} height={400}>
                <Pie data={pieData} cx={200} cy={200} outerRadius={120} dataKey="value" label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
