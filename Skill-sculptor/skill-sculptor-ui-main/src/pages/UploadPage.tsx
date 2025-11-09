import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import API from "../../api/axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { Upload, FileText, Image, Loader2, Sparkles } from "lucide-react";
import { Navigation } from "@/components/Navigation";

const UploadPage = () => {
    const navigate = useNavigate();
    const [uploading, setUploading] = useState(false);
    const [extractedText, setExtractedText] = useState("");
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState("");

    const onDrop = async (acceptedFiles: File[]) => {
        if (acceptedFiles.length === 0) return;

        const file = acceptedFiles[0];
        setFileName(file.name);
        setUploading(true);
        setProgress(0);

        const formData = new FormData();
        formData.append("file", file);

        try {
            setProgress(30);

            const response = await API.post(
                "/ocr/extract",
                formData,
                {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                }
            );

            setProgress(100);
            setExtractedText(response.data.text);
            toast.success("Text extracted successfully!");
        } catch (error: any) {
            console.error("Upload error:", error);
            toast.error(error.response?.data?.error || "Failed to extract text");
        } finally {
            setUploading(false);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "application/pdf": [".pdf"],
            "image/*": [".png", ".jpg", ".jpeg"],
        },
        maxFiles: 1,
    });

    const handleGenerateFlashcards = () => {
        if (!extractedText) {
            toast.error("No text to generate flashcards from");
            return;
        }
        navigate("/flashcards/generate", { state: { text: extractedText } });
    };

    const handleGenerateQuiz = () => {
        if (!extractedText) {
            toast.error("No text to generate quiz from");
            return;
        }
        navigate("/quiz/generate", { state: { text: extractedText } });
    };

    return (
        <div className="min-h-screen bg-background">
            <Navigation />
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl font-bold mb-2">Upload & Extract</h1>
                    <p className="text-muted-foreground mb-8">
                        Upload PDFs or images to extract text and generate learning materials
                    </p>

                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Upload File</CardTitle>
                            <CardDescription>
                                Support for PDF and image files (PNG, JPG, JPEG)
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div
                                {...getRootProps()}
                                className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                                    isDragActive
                                        ? "border-primary bg-primary/5"
                                        : "border-muted-foreground/25 hover:border-primary/50"
                                }`}
                            >
                                <input {...getInputProps()} />
                                {uploading ? (
                                    <div className="space-y-4">
                                        <Loader2 className="w-12 h-12 mx-auto animate-spin text-primary" />
                                        <p className="text-sm text-muted-foreground">
                                            Extracting text from {fileName}...
                                        </p>
                                        <Progress value={progress} className="w-full max-w-xs mx-auto" />
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-center gap-4">
                                            <FileText className="w-12 h-12 text-primary" />
                                            <Image className="w-12 h-12 text-primary" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-medium">
                                                {isDragActive
                                                    ? "Drop the file here"
                                                    : "Drag & drop a file here, or click to select"}
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                PDF or Image (Max 10MB)
                                            </p>
                                        </div>
                                        <Button className="mt-4">
                                            <Upload className="w-4 h-4 mr-2" />
                                            Select File
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {extractedText && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Extracted Text</CardTitle>
                                <CardDescription>
                                    Generate flashcards or quizzes from this text
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="bg-muted p-4 rounded-lg max-h-64 overflow-y-auto">
                                    <p className="text-sm whitespace-pre-wrap">{extractedText}</p>
                                </div>
                                <div className="flex gap-3">
                                    <Button onClick={handleGenerateFlashcards} className="flex-1">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate Flashcards
                                    </Button>
                                    <Button onClick={handleGenerateQuiz} className="flex-1" variant="outline">
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Generate Quiz
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UploadPage;
