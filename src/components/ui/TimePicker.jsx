import React, { useState, useRef, useEffect } from 'react';

const TimePicker = ({ value, onChange, name, maxHours = 2 }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedHour, setSelectedHour] = useState('00');
    const [selectedMinute, setSelectedMinute] = useState('00');
    const pickerRef = useRef(null);

    // Parse initial value
    useEffect(() => {
        if (value) {
            const [hours, minutes] = value.split(':');
            setSelectedHour(hours);
            setSelectedMinute(minutes);
        }
    }, [value]);

    // Close picker when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (pickerRef.current && !pickerRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleHourSelect = (hour) => {
        setSelectedHour(hour);
        // If selected hour is the max integer hour, validation needed for minutes
        const hourNum = parseInt(hour);
        const maxH = Math.floor(maxHours);

        let finalMinute = selectedMinute;

        // Calculate current decimal with new hour
        const currentDecimal = hourNum + (parseInt(selectedMinute) / 60);

        // If exceeds max, reset minutes to 00 if that fits, or keep as is if 00 is also invalid (unlikely)
        if (currentDecimal > maxHours) {
            finalMinute = '00';
        }

        setSelectedMinute(finalMinute);
        const newValue = `${hour}:${finalMinute}`;
        onChange({ target: { name, value: newValue } });
    };

    const handleMinuteSelect = (minute) => {
        // Double check against maxHours just in case
        const timeVal = parseInt(selectedHour) + (parseInt(minute) / 60);
        if (timeVal > maxHours) return;

        setSelectedMinute(minute);
        const newValue = `${selectedHour}:${minute}`;
        onChange({ target: { name, value: newValue } });
        // Auto-close after selecting minute
        setTimeout(() => setIsOpen(false), 200);
    };

    // Generate all hours (00-23)
    const hours = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));

    // Generate minutes (00, 05, 10, 15, ..., 55)
    const minutes = Array.from({ length: 12 }, (_, i) => String(i * 5).padStart(2, '0'));

    return (
        <div className="relative" ref={pickerRef}>
            {/* Input Display */}
            <input
                type="text"
                value={value}
                onClick={() => setIsOpen(!isOpen)}
                readOnly
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm text-gray-600 cursor-pointer bg-white"
                placeholder="00:00"
            />

            {/* Picker Dropdown */}
            {isOpen && (
                <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-2xl z-50 overflow-hidden" style={{ width: '450px' }}>
                    <div className="grid grid-cols-3 divide-x divide-gray-200">
                        {/* Hour Selection */}
                        <div className="col-span-2 p-4 bg-gray-50">
                            <h4 className="text-sm font-bold text-gray-600 text-center mb-3">Hour</h4>
                            <div className="grid grid-cols-6 gap-2 max-h-48 overflow-y-auto pr-1">
                                {hours.map((hour) => {
                                    const hourNum = parseInt(hour);
                                    // Disable if hour itself is greater than maxHours (e.g. if max is 1.5, hour 2 is disabled)
                                    // Or if (hour > maxHours) - strict greater.
                                    // If maxHours is 1.5, hour 1 is OK. Hour 2 is NOT.
                                    const isDisabled = hourNum > maxHours;

                                    return (
                                        <button
                                            key={hour}
                                            type="button"
                                            onClick={() => !isDisabled && handleHourSelect(hour)}
                                            disabled={isDisabled}
                                            className={`h-9 text-sm font-medium rounded transition-all ${isDisabled
                                                ? 'bg-white text-gray-300 cursor-not-allowed'
                                                : selectedHour === hour
                                                    ? 'bg-indigo-600 text-white shadow-md'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {hour}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Minute Selection */}
                        <div className="col-span-1 p-4 bg-gray-50">
                            <h4 className="text-sm font-bold text-gray-600 text-center mb-3">Minute</h4>
                            <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
                                {minutes.map((minute) => {
                                    const timeVal = parseInt(selectedHour) + (parseInt(minute) / 60);
                                    // Use a small epsilon for float comparison if needed, or strict >
                                    const isDisabled = timeVal > maxHours + 0.001;

                                    return (
                                        <button
                                            key={minute}
                                            type="button"
                                            onClick={() => !isDisabled && handleMinuteSelect(minute)}
                                            disabled={isDisabled}
                                            className={`h-9 text-sm font-medium rounded transition-all ${isDisabled
                                                ? 'bg-white text-gray-300 cursor-not-allowed'
                                                : selectedMinute === minute
                                                    ? 'bg-indigo-600 text-white shadow-md'
                                                    : 'bg-white text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            {minute}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimePicker;
