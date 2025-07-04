import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trash2,
  Plus,
  Download,
  Calculator,
  GraduationCap,
  BookOpen,
  TrendingUp,
  Star,
  Award,
} from "lucide-react";

const convertGradeToGPA = (grade, system) => {
  const numGrade = parseFloat(grade);
  if (isNaN(numGrade) || numGrade < 0 || numGrade > 100) return 0.0;

  if (system === "4") {
    if (numGrade >= 95) return 4.0; // A+
    if (numGrade >= 90) return 3.75; // A
    if (numGrade >= 85) return 3.5; // B+
    if (numGrade >= 80) return 3.0; // B
    if (numGrade >= 75) return 2.5; // C+
    if (numGrade >= 70) return 2.0; // C
    if (numGrade >= 65) return 1.5; // D+
    if (numGrade >= 60) return 1.0; // D
    return 0.0; // F
  } else {
    if (numGrade >= 95) return 5.0; // A+
    if (numGrade >= 90) return 4.75; // A
    if (numGrade >= 85) return 4.5; // B+
    if (numGrade >= 80) return 4.0; // B
    if (numGrade >= 75) return 3.5; // C+
    if (numGrade >= 70) return 3.0; // C
    if (numGrade >= 65) return 2.5; // D+
    if (numGrade >= 60) return 2.0; // D
    return 1.0; // F
  }
};

const getLetterGrade = (grade) => {
  const numGrade = parseFloat(grade);
  if (isNaN(numGrade) || numGrade < 0 || numGrade > 100) return "F";

  if (numGrade >= 95) return "A+";
  if (numGrade >= 90) return "A";
  if (numGrade >= 85) return "B+";
  if (numGrade >= 80) return "B";
  if (numGrade >= 75) return "C+";
  if (numGrade >= 70) return "C";
  if (numGrade >= 65) return "D+";
  if (numGrade >= 60) return "D";
  return "F";
};

const generatePDF = async (data) => {
  try {
    const { jsPDF } = await import("jspdf");
    const doc = new jsPDF();

    const primaryColor = [41, 128, 185];
    const secondaryColor = [52, 73, 94];
    const accentColor = [46, 204, 113];

    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 50, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.text("GPA REPORT", 105, 25, { align: "center" });

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text("Academic Performance Summary", 105, 35, { align: "center" });

    doc.setTextColor(0, 0, 0);

    let yPos = 70;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text("ACADEMIC INFORMATION", 20, yPos);

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(2);
    doc.line(20, yPos + 2, 190, yPos + 2);

    yPos += 15;
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 0, 0);

    doc.setFillColor(240, 240, 240);
    doc.roundedRect(20, yPos - 5, 170, 12, 2, 2, "F");
    doc.text(`GPA System: ${data.gradeSystem}.00 Scale`, 25, yPos + 2);
    yPos += 20;

    if (data.previousGPA && data.previousHours) {
      doc.setFillColor(250, 250, 250);
      doc.roundedRect(20, yPos - 5, 170, 25, 2, 2, "F");

      doc.setFont("helvetica", "bold");
      doc.text("Previous Academic Record:", 25, yPos + 2);
      doc.setFont("helvetica", "normal");
      doc.text(`• Previous GPA: ${data.previousGPA}`, 25, yPos + 10);
      doc.text(`• Previous Credit Hours: ${data.previousHours}`, 25, yPos + 18);
      yPos += 35;
    }

    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text("COURSE DETAILS", 20, yPos);

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(2);
    doc.line(20, yPos + 2, 190, yPos + 2);

    yPos += 20;

    doc.setFillColor(...primaryColor);
    doc.rect(20, yPos - 8, 170, 12, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("COURSE", 25, yPos - 2);
    doc.text("HOURS", 85, yPos - 2);
    doc.text("GRADE", 115, yPos - 2);
    doc.text("LETTER", 145, yPos - 2);
    doc.text("POINTS", 170, yPos - 2);

    yPos += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");

    data.subjects.forEach((subject, index) => {
      if (subject.name || subject.grade || subject.hours) {
        if (index % 2 === 0) {
          doc.setFillColor(248, 248, 248);
          doc.rect(20, yPos - 6, 170, 10, "F");
        }

        const courseName = subject.name || `Course ${index + 1}`;
        doc.text(
          courseName.length > 12
            ? courseName.substring(0, 12) + "..."
            : courseName,
          25,
          yPos
        );

        doc.text(subject.hours.toString(), 90, yPos);

        const grade = subject.grade;
        if (grade >= 90) doc.setTextColor(...accentColor);
        else if (grade >= 80) doc.setTextColor(243, 156, 18);
        else if (grade >= 70) doc.setTextColor(230, 126, 34);
        else doc.setTextColor(231, 76, 60);

        doc.text(`${grade}/100`, 115, yPos);

        doc.setTextColor(0, 0, 0);
        const letterGrade = getLetterGrade(grade);
        doc.text(letterGrade, 150, yPos);

        doc.text(subject.points.toFixed(2), 175, yPos);

        yPos += 12;
      }
    });

    yPos += 15;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...secondaryColor);
    doc.text("ACADEMIC RESULTS", 20, yPos);

    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(2);
    doc.line(20, yPos + 2, 190, yPos + 2);

    yPos += 20;

    const cardWidth = 80;
    const cardHeight = 25;
    const cardSpacing = 10;

    doc.setFillColor(...accentColor);
    doc.roundedRect(20, yPos, cardWidth, cardHeight, 3, 3, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("SEMESTER GPA", 25, yPos + 8);
    doc.setFontSize(16);
    doc.text(data.results.semesterGPA.toString(), 25, yPos + 18);

    doc.setFillColor(...primaryColor);
    doc.roundedRect(
      20 + cardWidth + cardSpacing,
      yPos,
      cardWidth,
      cardHeight,
      3,
      3,
      "F"
    );
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CUMULATIVE GPA", 25 + cardWidth + cardSpacing, yPos + 8);
    doc.setFontSize(16);
    doc.text(
      data.results.cumulativeGPA.toString(),
      25 + cardWidth + cardSpacing,
      yPos + 18
    );

    yPos += 35;

    doc.setFillColor(250, 250, 250);
    doc.roundedRect(20, yPos, 170, 20, 2, 2, "F");
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(
      `Total Semester Points: ${data.results.totalPoints}`,
      25,
      yPos + 8
    );
    doc.text(`Total Semester Hours: ${data.results.totalHours}`, 25, yPos + 15);

    const gpa = data.results.semesterGPA;
    let performance = "";
    let performanceColor = [0, 0, 0];

    if (gpa >= 3.5) {
      performance = "Excellent Performance";
      performanceColor = accentColor;
    } else if (gpa >= 3.0) {
      performance = "Good Performance";
      performanceColor = [243, 156, 18];
    } else if (gpa >= 2.5) {
      performance = "Satisfactory Performance";
      performanceColor = [230, 126, 34];
    } else {
      performance = "Needs Improvement";
      performanceColor = [231, 76, 60];
    }

    doc.setTextColor(...performanceColor);
    doc.setFont("helvetica", "bold");
    doc.text(performance, 110, yPos + 12);

    doc.save(`GPA-Report-${new Date().toISOString().split("T")[0]}.pdf`);

    console.log("PDF generated successfully!");
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("An error occurred while generating the PDF. Please try again.");
  }
};

function App() {
  const [gradeSystem, setGradeSystem] = useState("4");
  const [previousGPA, setPreviousGPA] = useState("");
  const [previousHours, setPreviousHours] = useState("");
  const [subjects, setSubjects] = useState([
    { id: 1, name: "", hours: "", grade: "", gpaPoints: 0, points: 0 },
  ]);
  const [results, setResults] = useState({
    semesterGPA: 0,
    cumulativeGPA: 0,
    totalPoints: 0,
    totalHours: 0,
    totalCumulativePoints: 0,
    totalCumulativeHours: 0,
  });

  const addSubject = () => {
    const newId =
      subjects.length > 0 ? Math.max(...subjects.map((s) => s.id)) + 1 : 1;
    setSubjects([
      ...subjects,
      { id: newId, name: "", hours: "", grade: "", gpaPoints: 0, points: 0 },
    ]);
  };

  const removeSubject = (id) => {
    if (subjects.length > 1) {
      setSubjects(subjects.filter((s) => s.id !== id));
    }
  };

  const updateSubject = (id, field, value) => {
    setSubjects(
      subjects.map((subject) => {
        if (subject.id === id) {
          const updated = { ...subject, [field]: value };
          const grade = parseFloat(updated.grade);
          const hours = parseFloat(updated.hours) || 0;
          if (!isNaN(grade) && !isNaN(hours)) {
            updated.gpaPoints = convertGradeToGPA(grade, gradeSystem);
            updated.points = updated.gpaPoints * hours;
          } else {
            updated.gpaPoints = 0;
            updated.points = 0;
          }
          return updated;
        }
        return subject;
      })
    );
  };

  const calculateResults = () => {
    const validSubjects = subjects.filter(
      (s) =>
        !isNaN(parseFloat(s.grade)) &&
        !isNaN(parseFloat(s.hours)) &&
        parseFloat(s.grade) >= 0 &&
        parseFloat(s.hours) > 0
    );
    const totalPoints = validSubjects.reduce((sum, s) => sum + s.points, 0);
    const totalHours = validSubjects.reduce(
      (sum, s) => sum + parseFloat(s.hours),
      0
    );
    const semesterGPA = totalHours > 0 ? totalPoints / totalHours : 0;

    let cumulativeGPA = semesterGPA;
    let totalCumulativePoints = totalPoints;
    let totalCumulativeHours = totalHours;

    const prevGPA = parseFloat(previousGPA);
    const prevHours = parseFloat(previousHours);
    if (!isNaN(prevGPA) && !isNaN(prevHours) && prevGPA >= 0 && prevHours > 0) {
      totalCumulativePoints += prevGPA * prevHours;
      totalCumulativeHours += prevHours;
      cumulativeGPA =
        totalCumulativeHours > 0
          ? totalCumulativePoints / totalCumulativeHours
          : 0;
    }

    setResults({
      semesterGPA: parseFloat(semesterGPA.toFixed(2)),
      cumulativeGPA: parseFloat(cumulativeGPA.toFixed(2)),
      totalPoints: parseFloat(totalPoints.toFixed(2)),
      totalHours: parseFloat(totalHours.toFixed(2)),
      totalCumulativePoints: parseFloat(totalCumulativePoints.toFixed(2)),
      totalCumulativeHours: parseFloat(totalCumulativeHours.toFixed(2)),
    });
  };

  useEffect(() => {
    calculateResults();
  }, [subjects, previousGPA, previousHours, gradeSystem]);

  const exportToPDF = () => {
    const data = {
      gradeSystem,
      previousGPA,
      previousHours,
      subjects: subjects.filter((s) => s.name || s.grade || s.hours),
      results,
    };
    generatePDF(data);
  };

  const getGradeColor = (grade) => {
    const numGrade = parseFloat(grade);
    if (numGrade >= 90) return "from-emerald-500 to-green-600";
    if (numGrade >= 80) return "from-blue-500 to-indigo-600";
    if (numGrade >= 70) return "from-yellow-500 to-orange-600";
    if (numGrade >= 60) return "from-orange-500 to-red-600";
    return "from-red-500 to-red-700";
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-purple-100 relative overflow-hidden"
      dir="rtl"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/5 via-purple-900/5 to-violet-900/5"></div>

      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-purple-400/20 to-violet-400/20 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-violet-400/20 to-indigo-400/20 rounded-full blur-xl animate-pulse"></div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10 max-w-7xl">
        <header className="text-center mb-20">
          <div className="flex items-center justify-center gap-6 mb-10">
            <div className="p-5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl shadow-2xl animate-bounce">
              {/* <GraduationCap className="w-12 h-12 text-white" /> */}
            </div>
            <h2 className="text-7xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-violet-600 bg-clip-text text-transparent leading-tight">
              حاسبة المعدل التراكمي
            </h2>
            <div className="p-5 bg-gradient-to-r from-purple-500 to-violet-600 rounded-3xl shadow-2xl animate-bounce">
              {/* <Calculator className="w-12 h-12 text-white" /> */}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-12">
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02]">
              <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-t-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/50 to-purple-700/50 animate-pulse"></div>
                <CardTitle className="text-3xl font-bold flex items-center gap-4 relative z-10 py-2">
                  <Calculator className="w-8 h-8" />
                  نظام GPA المستخدم
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="flex justify-center">
                  <div className="flex bg-gradient-to-r from-slate-100 to-indigo-50 rounded-3xl p-4 shadow-inner border border-indigo-100">
                    <button
                      onClick={() => setGradeSystem("4")}
                      className={`px-12 py-5 rounded-2xl text-2xl font-bold transition-all duration-500 transform ${
                        gradeSystem === "4"
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl scale-110"
                          : "text-slate-600 hover:text-indigo-600 hover:bg-white/50 hover:scale-105"
                      }`}
                    >
                      من 4.00
                    </button>
                    <button
                      onClick={() => setGradeSystem("5")}
                      className={`px-12 py-5 rounded-2xl text-2xl font-bold transition-all duration-500 transform ${
                        gradeSystem === "5"
                          ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-2xl scale-110"
                          : "text-slate-600 hover:text-indigo-600 hover:bg-white/50 hover:scale-105"
                      }`}
                    >
                      من 5.00
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02]">
              <CardHeader className="bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-t-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-violet-700/50 animate-pulse"></div>
                <CardTitle className="text-3xl font-bold flex items-center gap-4 relative z-10 py-2">
                  <TrendingUp className="w-8 h-8" />
                  معلومات المعدل السابق
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="space-y-5 group">
                    <Label
                      htmlFor="previousHours"
                      className="text-slate-700 font-bold text-xl flex items-center gap-3"
                    >
                      <Star className="w-5 h-5 text-amber-500" />
                      عدد الساعات السابقة
                    </Label>
                    <Input
                      id="previousHours"
                      type="number"
                      value={previousHours}
                      onChange={(e) => setPreviousHours(e.target.value)}
                      className="bg-gradient-to-r from-slate-50 to-indigo-50 border-2 border-indigo-200 text-slate-800 placeholder-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-xl py-5 group-hover:shadow-lg rounded-xl text-right"
                      placeholder="أدخل عدد الساعات"
                    />
                  </div>
                  <div className="space-y-5 group">
                    <Label
                      htmlFor="previousGPA"
                      className="text-slate-700 font-bold text-xl flex items-center gap-3"
                    >
                      <Award className="w-5 h-5 text-purple-500" />
                      المعدل التراكمي السابق
                    </Label>
                    <Input
                      id="previousGPA"
                      type="number"
                      step="0.01"
                      value={previousGPA}
                      onChange={(e) => setPreviousGPA(e.target.value)}
                      className="bg-gradient-to-r from-slate-50 to-purple-50 border-2 border-purple-200 text-slate-800 placeholder-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-xl py-5 group-hover:shadow-lg rounded-xl text-right"
                      placeholder="أدخل المعدل السابق"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 hover:scale-[1.02]">
              <CardHeader className="bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-t-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-violet-600/50 to-purple-700/50 animate-pulse"></div>
                <CardTitle className="text-3xl font-bold flex items-center gap-4 relative z-10 py-2">
                  <BookOpen className="w-8 h-8" />
                  المواد الدراسية
                </CardTitle>
              </CardHeader>
              <CardContent className="p-10">
                <div className="space-y-10">
                  {subjects.map((subject, index) => (
                    <div
                      key={subject.id}
                      className="bg-gradient-to-r from-slate-50 to-indigo-50 rounded-3xl p-8 border-2 border-indigo-100 hover:border-purple-300 transition-all duration-500 hover:shadow-xl group"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-end">
                        <div className="space-y-3">
                          <Label className="text-slate-700 font-bold text-lg flex items-center gap-2">
                            <BookOpen className="w-4 h-4 text-indigo-500" />
                            اسم المادة
                          </Label>
                          <Input
                            value={subject.name}
                            onChange={(e) =>
                              updateSubject(subject.id, "name", e.target.value)
                            }
                            className="bg-white border-2 border-indigo-200 text-slate-800 placeholder-slate-400 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 text-lg py-4 rounded-xl group-hover:shadow-md text-right"
                            placeholder="مثال: برمجة الويب"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-slate-700 font-bold text-lg flex items-center gap-2">
                            <Star className="w-4 h-4 text-purple-500" />
                            عدد الساعات
                          </Label>
                          <Input
                            type="number"
                            value={subject.hours}
                            onChange={(e) =>
                              updateSubject(subject.id, "hours", e.target.value)
                            }
                            className="bg-white border-2 border-purple-200 text-slate-800 placeholder-slate-400 focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 transition-all duration-300 text-lg py-4 rounded-xl group-hover:shadow-md text-right"
                            placeholder="مثال: 3"
                          />
                        </div>
                        <div className="space-y-3">
                          <Label className="text-slate-700 font-bold text-lg flex items-center gap-2">
                            <Award className="w-4 h-4 text-green-500" />
                            الدرجة من 100
                          </Label>
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={subject.grade}
                            onChange={(e) =>
                              updateSubject(subject.id, "grade", e.target.value)
                            }
                            className="bg-white border-2 border-green-200 text-slate-800 placeholder-slate-400 focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-300 text-lg py-4 rounded-xl group-hover:shadow-md text-right"
                            placeholder="مثال: 85"
                          />
                        </div>
                        <div className="flex items-center gap-4">
                          {subject.grade && (
                            <div
                              className={`px-6 py-4 rounded-2xl text-white font-bold text-lg bg-gradient-to-r ${getGradeColor(
                                subject.grade
                              )} shadow-lg`}
                            >
                              {getLetterGrade(subject.grade)}
                            </div>
                          )}
                          {subjects.length > 1 && (
                            <Button
                              onClick={() => removeSubject(subject.id)}
                              variant="destructive"
                              size="lg"
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-4"
                            >
                              <Trash2 className="w-5 h-5" />
                            </Button>
                          )}
                        </div>
                      </div>
                      {subject.grade && subject.hours && (
                        <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                            <div>
                              <p className="text-slate-600 font-medium text-sm">
                                التقدير
                              </p>
                              <p className="text-2xl font-bold text-indigo-600">
                                {getLetterGrade(subject.grade)}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-600 font-medium text-sm">
                                نقاط GPA
                              </p>
                              <p className="text-2xl font-bold text-purple-600">
                                {subject.gpaPoints.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-600 font-medium text-sm">
                                النقاط الإجمالية
                              </p>
                              <p className="text-2xl font-bold text-green-600">
                                {subject.points.toFixed(2)}
                              </p>
                            </div>
                            <div>
                              <p className="text-slate-600 font-medium text-sm">
                                الساعات
                              </p>
                              <p className="text-2xl font-bold text-orange-600">
                                {subject.hours}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  <Button
                    onClick={addSubject}
                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-xl font-bold py-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
                  >
                    <Plus className="w-6 h-6 ml-3" />
                    إضافة مادة جديدة
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-2xl hover:shadow-3xl transition-all duration-700 sticky top-8">
              <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-t-3xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-green-600/50 to-emerald-700/50 animate-pulse"></div>
                <CardTitle className="text-3xl font-bold flex items-center gap-4 relative z-10 py-2">
                  <TrendingUp className="w-8 h-8" />
                  النتائج
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 space-y-8">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 border-2 border-purple-200 hover:border-purple-300 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-bold text-xl flex items-center gap-2">
                        <Star className="w-5 h-5 text-purple-500" />
                        المعدل الفصلي
                      </span>
                      <span className="text-4xl font-bold text-purple-600">
                        {results.semesterGPA.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border-2 border-orange-200 hover:border-orange-300 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-bold text-xl flex items-center gap-2">
                        <Award className="w-5 h-5 text-orange-500" />
                        المعدل التراكمي
                      </span>
                      <span className="text-4xl font-bold text-orange-600">
                        {results.cumulativeGPA.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border-2 border-green-200 hover:border-green-300 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-bold text-lg flex items-center gap-2">
                        <Calculator className="w-5 h-5 text-green-500" />
                        إجمالي النقاط (الفصلية)
                      </span>
                      <span className="text-3xl font-bold text-green-600">
                        {results.totalPoints.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-bold text-lg flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-blue-500" />
                        إجمالي الساعات (الفصلية)
                      </span>
                      <span className="text-3xl font-bold text-blue-600">
                        {results.totalHours.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 border-2 border-teal-200 hover:border-teal-300 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-bold text-lg flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-teal-500" />
                        إجمالي النقاط (التراكمية)
                      </span>
                      <span className="text-3xl font-bold text-teal-600">
                        {results.totalCumulativePoints.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-violet-50 to-purple-50 rounded-2xl p-6 border-2 border-violet-200 hover:border-violet-300 transition-all duration-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-700 font-bold text-lg flex items-center gap-2">
                        <Star className="w-5 h-5 text-violet-500" />
                        إجمالي الساعات (التراكمية)
                      </span>
                      <span className="text-3xl font-bold text-violet-600">
                        {results.totalCumulativeHours.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={exportToPDF}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white text-xl font-bold py-6 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105"
                >
                  <Download className="w-6 h-6 ml-3" />
                  تصدير تقرير PDF
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <footer className="text-center mt-20 py-8 border-t border-indigo-200">
          <p className="text-slate-600 text-lg">
            • جميع الحقوق محفوظة{" "}
            <a
              href="https://fatimamohammedalzahrani.on.drv.tw/My/My.html"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-800 font-bold transition-colors duration-300 hover:underline"
            >
              فاطمة الزهراني
            </a>{" "}
            © 2024
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
