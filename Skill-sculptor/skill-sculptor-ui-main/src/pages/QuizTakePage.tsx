import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Clock, Trophy, Award, TrendingUp } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";

const QuizTakePage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [quiz, setQuiz] = useState<any>(null);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState<any[]>([]);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [startTime, setStartTime] = useState(Date.now());
    const [questionStartTime, setQuestionStartTime] = useState(Date.now());
    const [showResults, setShowResults] = useState(false);
    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchQuiz();
    }, [id]);

    const fetchQuiz = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`http://localhost:8080/api/quiz/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setQuiz(response.data.quiz);
        } catch (error) {
            toast.error("Failed to fetch quiz");
            navigate("/quiz");
        } finally {
            setLoading(false);
        }
    };

    const handleNext = () => {
        if (selectedAnswer === null) {
            toast.error("Please select an answer");
            return;
        }

        const timeSpent = (Date.now() - questionStartTime) / 1000;
        const newAnswers = [...answers, { selectedAnswer, timeSpent }];
        setAnswers(newAnswers);

        if (currentQuestion < quiz.questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            setQuestionStartTime(Date.now());
        } else {
            submitQuiz(newAnswers);
        }
    };

    const submitQuiz = async (finalAnswers: any[]) => {
        try {
            const token = localStorage.getItem("token");
            const totalTimeSpent = (Date.now() - startTime) / 1000;

            const response = await axios.post(
                `http://localhost:8080/api/quiz/${id}/attempt`,
                { answers: finalAnswers, timeSpent: totalTimeSpent },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setResults(response.data);
            setShowResults(true);
            toast.success(`Quiz completed! +${response.data.xpEarned} XP`);
        } catch (error) {
            toast.error("Failed to submit quiz");
        }
    };

    if (loading || !quiz) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex items-center justify-center h-screen">
                    <p>Loading quiz...</p>
                </div>
            </div>
        );
    }

    if (showResults && results) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto">
                        <Card className="mb-6">
                            <CardHeader className="text-center">
                                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
                                <CardTitle className="text-3xl">Quiz Completed!</CardTitle>
                                <CardDescription>Here are your results</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <Card>
                                        <CardContent className="pt-6 text-center">
                                            <div className="text-4xl font-bold text-primary mb-2">
                                                {results.percentage.toFixed(1)}%
                                            </div>
                                            <div className="text-sm text-muted-foreground">Score</div>
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardContent className="pt-6 text-center">
                                            <div className="text-4xl font-bold text-green-600 mb-2">
                                                +{results.xpEarned}
                                            </div>
                                            <div className="text-sm text-muted-foreground">XP Earned</div>
                                        </CardContent>
                                    </Card>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Correct Answers:</span>
                                        <Badge>{results.attempt.score} / {quiz.questions.length}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Adaptive Level:</span>
                                        <Badge variant="outline">{results.adaptiveLevel}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">New Level:</span>
                                        <Badge variant="outline">Level {results.userProgress.level}</Badge>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Total XP:</span>
                                        <Badge variant="outline">{results.userProgress.xp}</Badge>
                                    </div>
                                </div>

                                {results.userProgress.newBadges?.length > 0 && (
                                    <div className="border-t pt-4">
                                        <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                                            <Award className="w-5 h-5" />
                                            New Badges Earned!
                                        </h3>
                                        <div className="space-y-2">
                                            {results.userProgress.newBadges.map((badge: any, index: number) => (
                                                <Card key={index}>
                                                    <CardContent className="pt-4">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-3xl">🏆</span>
                                                            <div>
                                                                <div className="font-semibold">{badge.name}</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {badge.description}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold mb-3">Review Answers</h3>
                                    <div className="space-y-4">
                                        {quiz.questions.map((q: any, index: number) => {
                                            const userAnswer = results.attempt.answers[index];
                                            const isCorrect = userAnswer.isCorrect;
                                            
                                            return (
                                                <Card key={index} className={isCorrect ? "border-green-500" : "border-red-500"}>
                                                    <CardContent className="pt-4">
                                                        <div className="space-y-2">
                                                            <div className="flex justify-between items-start">
                                                                <p className="font-medium">Q{index + 1}: {q.question}</p>
                                                                <Badge variant={isCorrect ? "default" : "destructive"}>
                                                                    {isCorrect ? "✓" : "✗"}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-sm">
                                                                <span className="text-muted-foreground">Your answer: </span>
                                                                <span className={isCorrect ? "text-green-600" : "text-red-600"}>
                                                                    {q.options[userAnswer.selectedAnswer]}
                                                                </span>
                                                            </p>
                                                            {!isCorrect && (
                                                                <p className="text-sm">
                                                                    <span className="text-muted-foreground">Correct answer: </span>
                                                                    <span className="text-green-600">
                                                                        {q.options[q.correctAnswer]}
                                                                    </span>
                                                                </p>
                                                            )}
                                                            {q.explanation && (
                                                                <p className="text-sm text-muted-foreground italic">
                                                                    {q.explanation}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <Button className="flex-1" onClick={() => navigate("/quiz")}>
                                        Back to Quizzes
                                    </Button>
                                    <Button className="flex-1" variant="outline" onClick={() => window.location.reload()}>
                                        Retake Quiz
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        );
    }

    const question = quiz.questions[currentQuestion];
    const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <h1 className="text-2xl font-bold">{quiz.title}</h1>
                            <Badge variant="outline">
                                Question {currentQuestion + 1} / {quiz.questions.length}
                            </Badge>
                        </div>
                        <Progress value={progress} className="h-2" />
                    </div>

                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-xl">{question.question}</CardTitle>
                                <Badge>{question.difficulty}</Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <RadioGroup value={selectedAnswer?.toString()} onValueChange={(v) => setSelectedAnswer(parseInt(v))}>
                                <div className="space-y-3">
                                    {question.options.map((option: string, index: number) => (
                                        <div
                                            key={index}
                                            className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-accent"
                                            onClick={() => setSelectedAnswer(index)}
                                        >
                                            <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                                            <Label
                                                htmlFor={`option-${index}`}
                                                className="flex-1 cursor-pointer"
                                            >
                                                {option}
                                            </Label>
                                        </div>
                                    ))}
                                </div>
                            </RadioGroup>

                            <Button onClick={handleNext} className="w-full" disabled={selectedAnswer === null}>
                                {currentQuestion < quiz.questions.length - 1 ? "Next Question" : "Submit Quiz"}
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default QuizTakePage;
