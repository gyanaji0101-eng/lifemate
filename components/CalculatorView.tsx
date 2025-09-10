import React, { useState, useContext } from 'react';
import { AppContext } from '../context/AppContext';
import { Icons } from './Icons';

interface CalculatorViewProps {
  onBack: () => void;
}

const CalculatorView: React.FC<CalculatorViewProps> = ({ onBack }) => {
  const context = useContext(AppContext);
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  if (!context) return null;
  const { t } = context;

  const inputDigit = (digit: string) => {
    if (displayValue === 'Error') {
      setDisplayValue(digit);
      return;
    }
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const calculate = (first: number, second: number, op: string): number => {
      if (op === '+') return first + second;
      if (op === '-') return first - second;
      if (op === '*') return first * second;
      if (op === '/') return first / second;
      return second;
  }

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (isNaN(inputValue)) return;

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      setDisplayValue(String(result));
      setFirstOperand(result);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  const handleEquals = () => {
    const inputValue = parseFloat(displayValue);
    if (operator && firstOperand !== null) {
        if (isNaN(inputValue)) return;
        const result = calculate(firstOperand, inputValue, operator);
        setDisplayValue(String(result));
        setFirstOperand(null);
        setOperator(null);
        setWaitingForSecondOperand(false);
    }
  };

  const clearAll = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
  };

  const clearLastEntry = () => {
    if (displayValue === 'Error' || displayValue === 'Infinity' || displayValue === '-Infinity') {
      clearAll();
      return;
    }
    if (displayValue.length > 1) {
      setDisplayValue(displayValue.slice(0, -1));
    } else {
      setDisplayValue('0');
    }
  };


  const Button = ({ onClick, label, className = '' }: {onClick: () => void, label: string | React.ReactNode, className?: string}) => (
    <button
      onClick={onClick}
      className={`h-16 rounded-xl text-2xl font-semibold transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 ${className}`}
    >
      {label}
    </button>
  );

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 mr-2 rounded-full hover:bg-slate-200 transition-colors">
          <Icons.ArrowLeft className="h-6 w-6 text-slate-700" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">{t({ en: 'Calculator', hi: 'कैलकुलेटर', bho: 'कैलकुलेटर', bn: 'ক্যালকুলেটর', ta: 'கால்குலேட்டர்' })}</h2>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-lg flex-grow flex flex-col">
        {/* Display */}
        <div className="bg-slate-800 text-white text-right rounded-lg p-4 mb-4">
          <p className="text-4xl font-light break-all" style={{minHeight: '48px'}}>{displayValue}</p>
        </div>

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2 flex-grow">
          <Button onClick={clearAll} label="AC" className="bg-red-200 text-red-700 hover:bg-red-300 col-span-2" />
          <Button onClick={clearLastEntry} label="⌫" className="bg-slate-200 text-slate-800 hover:bg-slate-300" />
          <Button onClick={() => performOperation('/')} label="÷" className="bg-amber-400 text-white hover:bg-amber-500" />

          <Button onClick={() => inputDigit('7')} label="7" className="bg-slate-200 text-slate-800 hover:bg-slate-300" />
          <Button onClick={() => inputDigit('8')} label="8" className="bg-slate-200 text-slate-800 hover:bg-slate-300" />
          <Button onClick={() => inputDigit('9')} label="9" className="bg-slate-200 text-slate-800 hover:bg-slate-300" />
          <Button onClick={() => performOperation('*')} label="×" className="bg-amber-400 text-white hover:bg-amber-500" />

          <Button onClick={() => inputDigit('4')} label="4" className="bg-slate-200 text-slate-800 hover:bg-slate-300" />
          <Button onClick={() => inputDigit('5')} label="5" className="bg-slate-200 text-slate-800 hover:bg-slate-300" />
          <Button onClick={() => inputDigit('6')} label="6" className="bg-slate-200 text-slate-800 hover:bg-slate-300" />
          <Button onClick={() => performOperation('-')} label="-" className="bg-amber-400 text-white hover:bg-amber-500" />

          <Button onClick={() => inputDigit('1')} label="1" className="bg-slate-200 text-slate-800 hover:bg-slate-300" />
          <Button onClick={() => inputDigit('2')} label="2" className="bg-slate-200 text-slate-800 hover:bg-slate-300" />
          <Button onClick={() => inputDigit('3')} label="3" className="bg-slate-200 text-slate-800 hover:bg-slate-300" />
          <Button onClick={() => performOperation('+')} label="+" className="bg-amber-400 text-white hover:bg-amber-500" />

          <Button onClick={() => inputDigit('0')} label="0" className="bg-slate-200 text-slate-800 hover:bg-slate-300 col-span-2" />
          <Button onClick={inputDecimal} label="." className="bg-slate-200 text-slate-800 hover:bg-slate-300" />
          <Button onClick={handleEquals} label="=" className="bg-teal-600 text-white hover:bg-teal-700" />
        </div>
      </div>
    </div>
  );
};

export default CalculatorView;