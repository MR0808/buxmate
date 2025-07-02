'use client';

import { Clock } from 'lucide-react';
import { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TimePickerProps {
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
}

export function TimePicker({
    value,
    onChange,
    placeholder = 'Select time',
    disabled
}: TimePickerProps) {
    const [open, setOpen] = useState(false);
    const [hours, setHours] = useState('12');
    const [minutes, setMinutes] = useState('00');
    const [period, setPeriod] = useState('AM');

    // Parse the value when it changes
    useEffect(() => {
        if (value) {
            const [time, periodPart] = value.split(' ');
            if (time && periodPart) {
                const [h, m] = time.split(':');
                setHours(h);
                setMinutes(m);
                setPeriod(periodPart);
            } else if (time) {
                // Handle 24-hour format
                const [h, m] = time.split(':');
                const hour24 = Number.parseInt(h);
                const hour12 =
                    hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
                setHours(hour12.toString().padStart(2, '0'));
                setMinutes(m);
                setPeriod(hour24 >= 12 ? 'PM' : 'AM');
            }
        }
    }, [value]);

    const handleTimeChange = () => {
        const timeString = `${hours}:${minutes} ${period}`;
        onChange?.(timeString);
        setOpen(false);
    };

    const formatDisplayTime = () => {
        if (!value) return placeholder;
        return value;
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    className={cn(
                        'w-full justify-start text-left font-normal h-12 rounded-xl',
                        !value && 'text-muted-foreground'
                    )}
                    disabled={disabled}
                >
                    <Clock className="mr-2 h-4 w-4" />
                    {formatDisplayTime()}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
                <div className="space-y-4">
                    <div className="text-sm font-medium">Select Time</div>
                    <div className="flex items-center space-x-2">
                        <div className="space-y-2">
                            <Label htmlFor="hours" className="text-xs">
                                Hours
                            </Label>
                            <Input
                                id="hours"
                                type="number"
                                min="1"
                                max="12"
                                value={hours}
                                onChange={(e) =>
                                    setHours(e.target.value.padStart(2, '0'))
                                }
                                className="w-16 text-center"
                            />
                        </div>
                        <div className="pt-6">:</div>
                        <div className="space-y-2">
                            <Label htmlFor="minutes" className="text-xs">
                                Minutes
                            </Label>
                            <Input
                                id="minutes"
                                type="number"
                                min="0"
                                max="59"
                                step="5"
                                value={minutes}
                                onChange={(e) =>
                                    setMinutes(e.target.value.padStart(2, '0'))
                                }
                                className="w-16 text-center"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xs">Period</Label>
                            <div className="flex flex-col space-y-1">
                                <Button
                                    type="button"
                                    variant={
                                        period === 'AM' ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => setPeriod('AM')}
                                    className="w-12 h-8"
                                >
                                    AM
                                </Button>
                                <Button
                                    type="button"
                                    variant={
                                        period === 'PM' ? 'default' : 'outline'
                                    }
                                    size="sm"
                                    onClick={() => setPeriod('PM')}
                                    className="w-12 h-8"
                                >
                                    PM
                                </Button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button size="sm" onClick={handleTimeChange}>
                            Set Time
                        </Button>
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    );
}
