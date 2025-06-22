import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calculator, DollarSign, Server, Users, Zap } from "lucide-react";

interface CostBreakdown {
  computeUnits: number;
  storage: number;
  bandwidth: number;
  total: number;
  monthly: number;
}

export default function CostSimulation() {
  const [users, setUsers] = useState(10);
  const [requestsPerUser, setRequestsPerUser] = useState(5);
  const [tier, setTier] = useState("basic");
  const [results, setResults] = useState<CostBreakdown | null>(null);

  const calculateCosts = () => {
    const totalRequests = users * requestsPerUser;
    
    // Compute unit calculations (based on typical cloud pricing)
    const computePerRequest = 0.1; // 0.1 compute units per request processing
    const computeForUI = users * 0.5; // 0.5 units per active user session
    const totalCompute = (totalRequests * computePerRequest) + computeForUI;
    
    // Storage calculations (PostgreSQL + file storage)
    const storagePerRequest = 0.002; // 2KB per request on average
    const totalStorageGB = (totalRequests * storagePerRequest) / 1024;
    const storageCost = totalStorageGB * 0.25; // $0.25 per GB
    
    // Bandwidth calculations
    const bandwidthPerUser = 0.1; // 100MB per user per month
    const totalBandwidthGB = users * bandwidthPerUser;
    const bandwidthCost = totalBandwidthGB * 0.12; // $0.12 per GB
    
    // Tier multipliers
    const tierMultipliers = {
      basic: 1.0,
      professional: 1.5,
      enterprise: 2.0
    };
    
    const multiplier = tierMultipliers[tier as keyof typeof tierMultipliers];
    
    // Final calculations
    const computeCost = totalCompute * 0.000024 * multiplier; // $0.000024 per compute unit
    const total = computeCost + storageCost + bandwidthCost;
    
    setResults({
      computeUnits: totalCompute,
      storage: storageCost,
      bandwidth: bandwidthCost,
      total: total,
      monthly: total * 12
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    }).format(amount);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Cost Simulation</h1>
        <p className="text-gray-600">Estimate hosting costs for your Product Backlog Estimator</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Parameters */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Usage Parameters
            </CardTitle>
            <CardDescription>
              Configure your expected usage to estimate costs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="users">Number of Active Users</Label>
              <Input
                id="users"
                type="number"
                value={users}
                onChange={(e) => setUsers(Number(e.target.value))}
                min="1"
                max="10000"
              />
              <p className="text-sm text-gray-500 mt-1">Users accessing the app monthly</p>
            </div>

            <div>
              <Label htmlFor="requests">Requests per User</Label>
              <Input
                id="requests"
                type="number"
                value={requestsPerUser}
                onChange={(e) => setRequestsPerUser(Number(e.target.value))}
                min="1"
                max="100"
              />
              <p className="text-sm text-gray-500 mt-1">Average backlog requests created per user</p>
            </div>

            <div>
              <Label htmlFor="tier">Service Tier</Label>
              <Select value={tier} onValueChange={setTier}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="basic">Basic (Shared resources)</SelectItem>
                  <SelectItem value="professional">Professional (Dedicated CPU)</SelectItem>
                  <SelectItem value="enterprise">Enterprise (High availability)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={calculateCosts} className="w-full">
              <Calculator className="h-4 w-4 mr-2" />
              Calculate Costs
            </Button>
          </CardContent>
        </Card>

        {/* Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Cost Breakdown
            </CardTitle>
            <CardDescription>
              Monthly cost estimation based on your parameters
            </CardDescription>
          </CardHeader>
          <CardContent>
            {results ? (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Zap className="h-5 w-5 mx-auto mb-1 text-blue-600" />
                    <p className="text-sm text-gray-600">Compute Units</p>
                    <p className="font-semibold">{results.computeUnits.toFixed(1)}</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Server className="h-5 w-5 mx-auto mb-1 text-green-600" />
                    <p className="text-sm text-gray-600">Total Requests</p>
                    <p className="font-semibold">{users * requestsPerUser}</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Compute & Processing:</span>
                    <span>{formatCurrency(results.total - results.storage - results.bandwidth)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Database Storage:</span>
                    <span>{formatCurrency(results.storage)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bandwidth:</span>
                    <span>{formatCurrency(results.bandwidth)}</span>
                  </div>
                  <hr />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Monthly Total:</span>
                    <span>{formatCurrency(results.total)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Annual Total:</span>
                    <span>{formatCurrency(results.monthly)}</span>
                  </div>
                </div>

                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="font-medium mb-2">Cost Per User</h4>
                  <p className="text-2xl font-bold text-blue-600">
                    {formatCurrency(results.total / users)}
                    <span className="text-sm font-normal text-gray-600">/month</span>
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Configure parameters and click Calculate to see cost estimation</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {results && (
        <Card>
          <CardHeader>
            <CardTitle>Cost Optimization Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-green-600 mb-2">Low Usage (1-50 users)</h4>
                <p className="text-sm text-gray-600">
                  Perfect for team use. Consider shared hosting or basic cloud tiers. 
                  Expected cost: {formatCurrency(0.5)} - {formatCurrency(5)} monthly.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-blue-600 mb-2">Medium Usage (51-500 users)</h4>
                <p className="text-sm text-gray-600">
                  Suitable for department or company use. Consider professional hosting with auto-scaling.
                  Expected cost: {formatCurrency(5)} - {formatCurrency(50)} monthly.
                </p>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium text-purple-600 mb-2">High Usage (500+ users)</h4>
                <p className="text-sm text-gray-600">
                  Enterprise deployment with dedicated resources, load balancing, and high availability.
                  Expected cost: {formatCurrency(50)}+ monthly.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}