import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertRequestSchema, type InsertRequest } from "@shared/schema";
import { getScoreColorClasses } from "@/lib/utils";

interface AddRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AddRequestModal({ isOpen, onClose }: AddRequestModalProps) {
  const [calculatedScore, setCalculatedScore] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertRequest>({
    resolver: zodResolver(insertRequestSchema),
    defaultValues: {
      title: "",
      description: "",
      technicalComplexity: 0,
      businessImpact: 0,
      resourceRequirements: 0,
      riskLevel: 0,
    },
  });

  const createRequestMutation = useMutation({
    mutationFn: async (data: InsertRequest) => {
      await apiRequest("POST", "/api/requests", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/requests"] });
      toast({
        title: "Success",
        description: "Request created successfully",
      });
      handleClose();
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to create request",
        variant: "destructive",
      });
    },
  });

  const watchedValues = form.watch();

  useEffect(() => {
    const score = (watchedValues.technicalComplexity || 0) + 
                  (watchedValues.businessImpact || 0) + 
                  (watchedValues.resourceRequirements || 0) + 
                  (watchedValues.riskLevel || 0);
    setCalculatedScore(score);
  }, [watchedValues]);

  const handleClose = () => {
    form.reset();
    setCalculatedScore(0);
    onClose();
  };

  const onSubmit = (data: InsertRequest) => {
    createRequestMutation.mutate(data);
  };

  const { scoreColorClass, scoreBgClass, complexityBadgeClass } = getScoreColorClasses(calculatedScore);

  const getComplexityText = (score: number) => {
    if (score >= 500) return 'Very High Complexity';
    if (score >= 200) return 'High Complexity';
    if (score >= 100) return 'Medium Complexity';
    return 'Low Complexity';
  };

  const getTimeEstimate = (score: number) => {
    if (score >= 500) return 'More than 6 months';
    if (score >= 200) return '3-6 months';
    if (score >= 100) return '1-3 months';
    return '~1 month';
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Request</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Request Title */}
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

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Describe the request details..." 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Scoring Factors */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Technical Complexity */}
              <FormField
                control={form.control}
                name="technicalComplexity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Technical Complexity *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select complexity" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="10">Very Low (10)</SelectItem>
                        <SelectItem value="25">Low (25)</SelectItem>
                        <SelectItem value="50">Medium (50)</SelectItem>
                        <SelectItem value="100">High (100)</SelectItem>
                        <SelectItem value="200">Very High (200)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Business Impact */}
              <FormField
                control={form.control}
                name="businessImpact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Business Impact *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select impact" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">Very Low (5)</SelectItem>
                        <SelectItem value="15">Low (15)</SelectItem>
                        <SelectItem value="30">Medium (30)</SelectItem>
                        <SelectItem value="50">High (50)</SelectItem>
                        <SelectItem value="100">Very High (100)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Resource Requirements */}
              <FormField
                control={form.control}
                name="resourceRequirements"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Resource Requirements *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select requirements" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">Minimal (5)</SelectItem>
                        <SelectItem value="20">Low (20)</SelectItem>
                        <SelectItem value="40">Medium (40)</SelectItem>
                        <SelectItem value="80">High (80)</SelectItem>
                        <SelectItem value="150">Very High (150)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Risk Level */}
              <FormField
                control={form.control}
                name="riskLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Risk Level *</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select risk level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="5">Very Low (5)</SelectItem>
                        <SelectItem value="15">Low (15)</SelectItem>
                        <SelectItem value="30">Medium (30)</SelectItem>
                        <SelectItem value="60">High (60)</SelectItem>
                        <SelectItem value="100">Very High (100)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
                {calculatedScore > 0 ? `Estimated timeline: ${getTimeEstimate(calculatedScore)}` : 'Select all factors to see estimated timeline'}
              </div>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createRequestMutation.isPending}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {createRequestMutation.isPending ? "Saving..." : "Save Request"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
