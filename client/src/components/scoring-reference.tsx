export default function ScoringReference() {
  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Scoring Reference</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Red Category */}
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-red-500">500+</div>
            <div className="text-red-500 font-medium">Red</div>
          </div>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="font-medium">• Very high complexity or effort</div>
            <div>• More than 6 months for construction phase with max capacity</div>
          </div>
        </div>

        {/* Yellow Category */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-yellow-600">200-500</div>
            <div className="text-yellow-600 font-medium">Yellow</div>
          </div>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="font-medium">• High complexity or effort</div>
            <div>• Between 3 & 6 months for construction phase with max capacity</div>
          </div>
        </div>

        {/* Green Category */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-green-600">100-200</div>
            <div className="text-green-600 font-medium">Green</div>
          </div>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="font-medium">• Medium complexity or effort</div>
            <div>• Between 1 & 3 months for construction phase with max capacity</div>
          </div>
        </div>

        {/* Light Green Category */}
        <div className="bg-lime-50 border border-lime-200 rounded-lg p-6">
          <div className="text-center mb-4">
            <div className="text-2xl font-bold text-lime-600">0-100</div>
            <div className="text-lime-600 font-medium">Light Green</div>
          </div>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="font-medium">• No complexity and low effort</div>
            <div>• ~1 month for construction phase with max capacity</div>
          </div>
        </div>
      </div>
    </div>
  );
}
