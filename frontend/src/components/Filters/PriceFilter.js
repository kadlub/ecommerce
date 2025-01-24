import React, { useState, useEffect, useCallback } from 'react';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import './PriceFilter.css';

const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
};

const PriceFilter = ({ onPriceChange }) => {
    const [range, setRange] = useState({
        min: 10,
        max: 1000,
    });

    // Debounced version of onPriceChange
    const handleRangeChange = useCallback(
        debounce((min, max) => {
            if (onPriceChange) {
                onPriceChange(min, max);
            }
        }, 300),
        [onPriceChange]
    );

    useEffect(() => {
        handleRangeChange(range.min, range.max);
    }, [range, handleRangeChange]);

    return (
        <div className="flex flex-col mb-4">
            <p className="text-[16px] text-black mt-5 mb-5">Cena</p>
            <RangeSlider
                className="custom-range-slider"
                min={0}
                max={5000}
                defaultValue={[range.min, range.max]}
                onInput={(values) =>
                    setRange({
                        min: values[0],
                        max: values[1],
                    })
                }
            />
            <div className="flex justify-between">
                <div className="border rounded-lg h-8 mt-4 max-w-[50%] w-[40%] flex items-center justify-center">
                    <p className="text-gray-600">{range?.min} zł</p>
                </div>
                <div className="border rounded-lg h-8 mt-4 max-w-[50%] w-[40%] flex items-center justify-center">
                    <p className="text-gray-600">{range?.max} zł</p>
                </div>
            </div>
        </div>
    );
};

export default PriceFilter;
