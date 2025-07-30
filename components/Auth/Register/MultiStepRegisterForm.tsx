'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { CheckCircle } from 'lucide-react';

import InitialRegistrationForm from './InitialRegistrationForm';
import EmailVerificationForm from './EmailVerificationForm';
import PhoneNumberForm from './PhoneNumberForm';
import PhoneVerificationForm from './PhoneVerificationForm';
import RegistrationComplete from './RegistrationComplete';
import {
    MultiStepRegisterFormProps,
    RegistrationData,
    RegistrationStep
} from '@/types/register';

const MultiStepRegisterForm = ({
    defaultCountry
}: MultiStepRegisterFormProps) => {
    const [currentStep, setCurrentStep] = useState<RegistrationStep>('initial');
    const [registrationData, setRegistrationData] = useState<RegistrationData>({
        name: '',
        lastName: '',
        email: '',
        password: '',
        overEighteen: false,
        terms: false
    });

    const updateRegistrationData = (data: Partial<RegistrationData>) => {
        setRegistrationData((prev) => ({ ...prev, ...data }));
    };

    const goToStep = (step: RegistrationStep) => {
        setCurrentStep(step);
    };

    return (
        <div>
            {currentStep === 'initial' && (
                <InitialRegistrationForm
                    data={registrationData}
                    onNext={(data) => {
                        updateRegistrationData(data);
                        goToStep('email-verify');
                    }}
                />
            )}

            {currentStep === 'email-verify' && (
                <EmailVerificationForm
                    email={registrationData.email}
                    userId={registrationData.userId}
                    onNext={(userId) => {
                        updateRegistrationData({ userId });
                        goToStep('phone-number');
                    }}
                />
            )}

            {currentStep === 'phone-number' && (
                <PhoneNumberForm
                    userId={registrationData.userId!}
                    onNext={(phoneNumber) => {
                        updateRegistrationData({ phoneNumber });
                        goToStep('phone-verify');
                    }}
                    defaultCountry={defaultCountry}
                />
            )}

            {currentStep === 'phone-verify' && (
                <PhoneVerificationForm
                    userId={registrationData.userId!}
                    phoneNumber={registrationData.phoneNumber!}
                    email={registrationData.email}
                    password={registrationData.password}
                    onNext={() => goToStep('complete')}
                />
            )}

            {currentStep === 'complete' && (
                <RegistrationComplete
                    name={registrationData.name}
                    email={registrationData.email}
                    phoneNumber={registrationData.phoneNumber || ''}
                />
            )}
            {/* </CardContent>
            </Card> */}
        </div>
    );
};

export default MultiStepRegisterForm;
