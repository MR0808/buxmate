'use client';

import { CheckCircle } from 'lucide-react';

const StepIndicator = ({
    currentStep,
    totalSteps
}: {
    currentStep: number;
    totalSteps: number;
}) => {
    return (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between">
                {Array.from({ length: totalSteps }, (_, index) => {
                    const stepNumber = index + 1;
                    const isCompleted = stepNumber < currentStep;
                    const isCurrent = stepNumber === currentStep;
                    const isUpcoming = stepNumber > currentStep;

                    return (
                        <div key={stepNumber} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`
                      w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-200
                      ${
                          isCompleted
                              ? 'bg-green-500 text-white'
                              : isCurrent
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-200 text-gray-500'
                      }
                    `}
                                >
                                    {isCompleted ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        stepNumber
                                    )}
                                </div>
                                <div className="mt-2 text-xs text-center max-w-20">
                                    <div
                                        className={`font-medium ${isCurrent ? 'text-blue-600' : 'text-gray-500'}`}
                                    >
                                        Step {stepNumber}
                                    </div>
                                </div>
                            </div>
                            {index < totalSteps - 1 && (
                                <div
                                    className={`
                      flex-1 h-0.5 mx-4 transition-all duration-200
                      ${isCompleted ? 'bg-green-500' : 'bg-gray-200'}
                    `}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Progress bar */}
            <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                <div
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                    style={{
                        width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`
                    }}
                />
            </div>
        </div>
    );
};

export default StepIndicator;
