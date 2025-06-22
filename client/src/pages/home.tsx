import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, ArrowUpDown } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Request } from "@shared/schema";
import ScoringReference from "@/components/scoring-reference";
import AddRequestModal from "@/components/add-request-modal";
import EditRequestModal from "@/components/edit-request-modal";
import RequestCard from "@/components/request-card";

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingRequest, setEditingRequest] = useState<Request | null>(null);
  const [filterValue, setFilterValue] = useState("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: requests = [], isLoading } = useQuery<Request[]>({
    queryKey: ["/api/hello"],
  });

  const deleteRequestMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/hello?id=${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/hello"] });
      toast({
        title: "Success",
        description: "Request deleted successfully",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete request",
        variant: "destructive",
      });
    },
  });

  const handleDeleteRequest = (id: number) => {
    deleteRequestMutation.mutate(id);
  };

  const handleEditRequest = (request: Request) => {
    setEditingRequest(request);
  };

  const handleSort = () => {
    setSortOrder(sortOrder === "desc" ? "asc" : "desc");
  };

  // Filter and sort requests
  const filteredAndSortedRequests = requests
    .filter((request) => {
      if (filterValue === "all") return true;
      if (filterValue === "red") return request.score >= 500;
      if (filterValue === "yellow") return request.score >= 200 && request.score < 500;
      if (filterValue === "green") return request.score >= 100 && request.score < 200;
      if (filterValue === "light-green") return request.score < 100;
      return true;
    })
    .sort((a, b) => {
      return sortOrder === "desc" ? b.score - a.score : a.score - b.score;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Product Backlog Estimator</h1>
            <Button 
              onClick={() => setIsAddModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Request
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Scoring Reference */}
        <ScoringReference />

        {/* Estimated Requests */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Estimated Requests</h2>
            <div className="flex gap-4">
              {/* Filter Dropdown */}
              <Select value={filterValue} onValueChange={setFilterValue}>
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Scores</SelectItem>
                  <SelectItem value="red">Red (500+)</SelectItem>
                  <SelectItem value="yellow">Yellow (200-500)</SelectItem>
                  <SelectItem value="green">Green (100-200)</SelectItem>
                  <SelectItem value="light-green">Light Green (0-100)</SelectItem>
                </SelectContent>
              </Select>

              {/* Sort Button */}
              <Button 
                variant="outline" 
                onClick={handleSort}
                className="flex items-center gap-2"
              >
                <ArrowUpDown className="w-4 h-4" />
                Sort by Score
              </Button>
            </div>
          </div>

          {/* Requests Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md border border-gray-200 p-6 animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 rounded w-24"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : filteredAndSortedRequests.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">
                📋
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests found</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first request estimation.</p>
              <Button 
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Add New Request
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedRequests.map((request) => (
                <RequestCard
                  key={request.id}
                  request={request}
                  onEdit={handleEditRequest}
                  onDelete={handleDeleteRequest}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AddRequestModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />
      
      {editingRequest && (
        <EditRequestModal 
          isOpen={!!editingRequest}
          onClose={() => setEditingRequest(null)}
          request={editingRequest}
        />
      )}
    </div>
  );
}
