import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertRequestSchema, type InsertRequest, type Request } from "@shared/schema";
import { ESTIMATION_QUESTIONS } from "@shared/questions";
import { getScoreColorClasses } from "@/lib/utils";

interface EditRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  request: Request;
}

export default function EditRequestModal({ isOpen, onClose, request }: EditRequestModalProps) {
  const [calculatedScore, setCalculatedScore] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertRequest>({
    resolver: zodResolver(insertRequestSchema),
    defaultValues: {
      title: request.title,
      answers: request.answers || ESTIMATION_QUESTIONS.map(() => ""),
    },
  });

  const updateRequestMutation = useMutation({
    mutationFn: async (data: InsertRequest) => {
      await apiRequest("PUT", `/api/index?id=${request.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/index"] });
      toast({
        title: "Success",
        description: "Request updated successfully",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update request",
        variant: "destructive",
      });
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    const answers = watchedValues.answers || [];
    let totalScore = 0;
    
    ESTIMATION_QUESTIONS.forEach((question, index) => {
      const selectedAnswer = answers[index];
      if (selectedAnswer) {
        const option = question.options.find(opt => opt.text === selectedAnswer);
        if (option) {
          totalScore += option.score;
        }
      }
    });
    
    setCalculatedScore(totalScore);
  }, [watchedValues]);

  // Reset form when request changes
  useEffect(() => {
    form.reset({
      title: request.title,
      answers: request.answers || ESTIMATION_QUESTIONS.map(() => ""),
    });
  }, [request, form]);

  const onSubmit = (data: InsertRequest) => {
    updateRequestMutation.mutate(data);
  };

  const { scoreColorClass, scoreBgClass, complexityBadgeClass } = getScoreColorClasses(calculatedScore);

  const getComplexityText = (score: number) => {
    if (score >= 500) return 'Very high complexity or effort';
    if (score >= 200) return 'High complexity or effort';
    if (score >= 100) return 'Medium complexity or effort';
    return 'No complexity and low effort';
  };

  const getTimeEstimate = (score: number) => {
    if (score >= 500) return 'More than 6 months for construction phase with max capacity';
    if (score >= 200) return 'Between 3 & 6 months for construction phase with max capacity';
    if (score >= 100) return 'Between 1 & 3 months for construction phase with max capacity';
    return '~1 month for construction phase with max capacity';
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Request</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Request Title Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Request Information</h3>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Request Title *</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter request title" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Questions Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Estimation Questions</h3>
              <div className="space-y-6">
                {ESTIMATION_QUESTIONS.map((question, index) => (
                  <FormField
                    key={question.id}
                    control={form.control}
                    name={`answers.${index}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{question.text} *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select an answer" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {question.options.map((option) => {
                              return (
                                <SelectItem key={option.text} value={option.text}>
                                  <span>{option.text}</span>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            </div>

            {/* Calculated Score Display */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <span className="text-sm font-medium text-gray-700">Calculated Score:</span>
                  <span className={`text-2xl font-bold ml-2 ${scoreColorClass}`}>{calculatedScore}</span>
                </div>
                {calculatedScore > 0 && (
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${complexityBadgeClass}`}>
                    {getComplexityText(calculatedScore)}
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-600 mt-2">
                {calculatedScore > 0 ? `Estimated timeline: ${getTimeEstimate(calculatedScore)}` : 'Answer all questions to see estimated timeline'}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={updateRequestMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {updateRequestMutation.isPending ? "Updating..." : "Update Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}