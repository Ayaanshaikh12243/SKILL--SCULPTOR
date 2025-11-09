import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Brain, ChevronLeft, ChevronRight, RotateCcw, Trash2 } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { Badge } from "@/components/ui/badge";

const FlashcardsPage = () => {
    const navigate = useNavigate();
    const [flashcards, setFlashcards] = useState<any[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFlashcards();
    }, []);

    const fetchFlashcards = async () => {
        try {
            const response = await API.get("/flashcard");
            setFlashcards(response.data.flashcards);
        } catch (error) {
            toast.error("Failed to fetch flashcards");
        } finally {
            setLoading(false);
        }
    };

    const handleReview = async (correct: boolean) => {
        if (flashcards.length === 0) return;

        try {
            await API.put(
                `/flashcard/${flashcards[currentIndex]._id}/review`,
                { correct }
            );

            toast.success(correct ? "+3 XP for correct answer!" : "+1 XP for trying!");
            nextCard();
        } catch (error) {
            toast.error("Failed to record review");
        }
    };

    const nextCard = () => {
        setShowAnswer(false);
        setCurrentIndex((prev) => (prev + 1) % flashcards.length);
    };

    const prevCard = () => {
        setShowAnswer(false);
        setCurrentIndex((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    };

    const deleteFlashcard = async () => {
        if (flashcards.length === 0) return;

        try {
            await API.delete(
                `/flashcard/${flashcards[currentIndex]._id}`
            );

            toast.success("Flashcard deleted");
            setFlashcards(flashcards.filter((_, i) => i !== currentIndex));
            if (currentIndex >= flashcards.length - 1) {
                setCurrentIndex(Math.max(0, currentIndex - 1));
            }
        } catch (error) {
            toast.error("Failed to delete flashcard");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="flex items-center justify-center h-screen">
                    <p>Loading flashcards...</p>
                </div>
            </div>
        );
    }

    if (flashcards.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <Navigation />
                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto text-center space-y-4">
                        <Brain className="w-16 h-16 mx-auto text-muted-foreground" />
                        <h2 className="text-2xl font-bold">No Flashcards Yet</h2>
                        <p className="text-muted-foreground">
                            Upload a document to generate flashcards automatically
                        </p>
                        <Button onClick={() => navigate("/upload")}>Upload Document</Button>
                    </div>
                </div>
            </div>
        );
    }

    const currentCard = flashcards[currentIndex];

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-2xl mx-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-4xl font-bold">Flashcards</h1>
                        <Badge variant="outline">
                            {currentIndex + 1} / {flashcards.length}
                        </Badge>
                    </div>

                    <Card className="mb-6 min-h-[400px] flex flex-col justify-center">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle>{currentCard.title}</CardTitle>
                                <div className="flex gap-2">
                                    <Badge>{currentCard.difficulty}</Badge>
                                    <Button variant="ghost" size="sm" onClick={deleteFlashcard}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent
                            className="flex-1 flex flex-col items-center justify-center cursor-pointer"
                            onClick={() => setShowAnswer(!showAnswer)}
                        >
                            <div className="text-center space-y-4 w-full">
                                <div className="text-lg font-medium text-muted-foreground">
                                    {showAnswer ? "Answer" : "Question"}
                                </div>
                                <div className="text-2xl font-semibold p-8">
                                    {showAnswer ? currentCard.back : currentCard.front}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Click to {showAnswer ? "hide" : "reveal"} answer
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {showAnswer && (
                        <div className="flex gap-3 mb-6">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleReview(false)}
                            >
                                ❌ Wrong
                            </Button>
                            <Button className="flex-1" onClick={() => handleReview(true)}>
                                ✅ Correct
                            </Button>
                        </div>
                    )}

                    <div className="flex justify-between">
                        <Button variant="outline" onClick={prevCard}>
                            <ChevronLeft className="w-4 h-4 mr-2" />
                            Previous
                        </Button>
                        <Button variant="outline" onClick={() => setShowAnswer(false)}>
                            <RotateCcw className="w-4 h-4 mr-2" />
                            Reset
                        </Button>
                        <Button variant="outline" onClick={nextCard}>
                            Next
                            <ChevronRight className="w-4 h-4 ml-2" />
                        </Button>
                    </div>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-muted-foreground">
                            Reviews: {currentCard.reviewCount} | Correct:{" "}
                            {currentCard.correctCount}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlashcardsPage;
