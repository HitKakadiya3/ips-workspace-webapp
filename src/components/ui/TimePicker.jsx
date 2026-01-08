import React, { useState, useRef, useEffect } from 'react';

const TimePicker = ({ value, onChange, name }) => {
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
        // If 2 hours selected, force minutes to 00 (disable minute selection)
        const finalMinute = hour === '02' ? '00' : selectedMinute;
        setSelectedMinute(finalMinute);
        const newValue = `${hour}:${finalMinute}`;
        onChange({ target: { name, value: newValue } });
    };

    const handleMinuteSelect = (minute) => {
        // Don't allow minute selection if hour is 02
        if (selectedHour === '02') return;

        setSelectedMinute(minute);
        const newValue = `${selectedHour}:${minute}`;
        onChange({ target: { name, value: newValue } });
        // Auto-close after selecting minute
        setTimeout(() => setIsOpen(false), 200);
    };

    // Generate all hours (00-23) - hours after 02 will be disabled
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
                                    const isDisabled = hourNum > 2;

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
                                {minutes.map((minute) => (
                                    <button
                                        key={minute}
                                        type="button"
                                        onClick={() => handleMinuteSelect(minute)}
                                        disabled={selectedHour === '02'}
                                        className={`h-9 text-sm font-medium rounded transition-all ${selectedHour === '02'
                                            ? 'bg-white text-gray-300 cursor-not-allowed'
                                            : selectedMinute === minute
                                                ? 'bg-indigo-600 text-white shadow-md'
                                                : 'bg-white text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        {minute}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TimePicker;
