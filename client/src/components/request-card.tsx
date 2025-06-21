import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import type { Request } from "@shared/schema";
import { getScoreColorClasses } from "@/lib/utils";

interface RequestCardProps {
  request: Request;
  onEdit: (request: Request) => void;
  onDelete: (id: number) => void;
}

export default function RequestCard({ request, onEdit, onDelete }: RequestCardProps) {
  const { scoreColorClass, scoreBgClass, complexityBadgeClass } = getScoreColorClasses(request.score);

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex-1 mr-4">{request.title}</h3>
        <div className="flex items-center gap-2">
          <div className={`${scoreBgClass} px-3 py-1 rounded-full`}>
            <span className={`text-2xl font-bold ${scoreColorClass}`}>{request.score}</span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(request)}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(request.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm mb-4">{request.description || "No description provided"}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className={`px-3 py-1 text-xs font-medium rounded-full ${complexityBadgeClass}`}>
            {request.complexity}
          </span>
        </div>
        <span className="text-sm text-gray-500">{request.estimatedTime}</span>
      </div>
    </div>
  );
}
