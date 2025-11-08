import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { DeleteRoadmapDialog } from '@/components/DeleteRoadmapDialog';
import API from '../../api/axios';

export default function RoadmapListPage() {
  const [roadmaps, setRoadmaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const goBack = () => {
    navigate(-1);
  };

  const handleDeleteRoadmap = async (roadmapId: string, roadmapSkill: string) => {
    setDeletingId(roadmapId);
    try {
      await API.delete(`/roadmap/${roadmapId}`);
      
      // Clear localStorage data for this roadmap
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.includes(`completed_resources_${roadmapId}_`)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      
      // Remove from local state
      setRoadmaps(prev => prev.filter(roadmap => roadmap._id !== roadmapId));
      
      toast({
        title: "Roadmap Deleted! 🗑️",
        description: `"${roadmapSkill}" has been permanently deleted.`,
      });
      
      // If no roadmaps left, redirect to query form
      if (roadmaps.length === 1) {
        navigate('/query-form');
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "Failed to delete roadmap",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    const fetchRoadmaps = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user?._id) {
          navigate('/login');
          return;
        }

        // Fetch all roadmaps directly
        const { data } = await API.get(`/roadmap/user/${user._id}/all`);
        const results = data?.roadmaps || [];

        if ((results?.length || 0) === 1) {
          navigate(`/roadmap/${results[0]._id}`);
          return;
        }

        setRoadmaps(results);
      } catch (err) {
        // If no dashboard or none saved, send to query form
        navigate('/query-form');
      } finally {
        setLoading(false);
      }
    };
    fetchRoadmaps();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600 text-lg">Loading your roadmaps...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Navigation />
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Button variant="outline" onClick={goBack} className="flex items-center space-x-2 mb-6">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span>Go Back</span>
          </Button>
        </div>
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Choose a Roadmap</h1>
          <p className="text-muted-foreground">Select what you want to continue learning</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {roadmaps.map((r, i) => (
            <Card key={i} className="border-0 shadow-card bg-card/80 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="capitalize">{r.skill?.replace(/-/g, ' ') || 'Learning Path'}</CardTitle>
                <CardDescription className="capitalize">Level: {r.level || '—'}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <Button className="bg-gradient-primary hover:opacity-90 border-0" onClick={() => navigate(`/roadmap/${r._id}`)}>
                    Open Roadmap
                  </Button>
                  
                  <DeleteRoadmapDialog
                    roadmapTitle={r.skill?.replace(/-/g, ' ') || 'Learning Path'}
                    onConfirm={() => handleDeleteRoadmap(r._id, r.skill?.replace(/-/g, ' ') || 'Learning Path')}
                    isLoading={deletingId === r._id}
                  >
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="text-destructive hover:text-destructive border-destructive/30 hover:border-destructive/50 hover:bg-destructive/5"
                    >
                      Delete
                    </Button>
                  </DeleteRoadmapDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {roadmaps.length === 0 && (
          <div className="text-center text-muted-foreground mt-8">
            No roadmaps yet. <Button variant="link" onClick={() => navigate('/query-form?new=1')}>Create one</Button>
          </div>
        )}
      </div>
    </div>
  );
}


