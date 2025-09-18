import React, { useState, useContext } from "react";
import { ThemeContext } from "./ThemeContext";
import {
    FaSun,
    FaMoon,
    FaCalculator,
    FaRedoAlt,
    FaInfoCircle,
    FaReceipt,
} from "react-icons/fa";

const BillSplitter = () => {
    const { dark, setDark } = useContext(ThemeContext);

    const [total, setTotal] = useState("");
    const [people, setPeople] = useState(2);
    const [tip, setTip] = useState(0);
    const [tax, setTax] = useState(0);
    const [roundUp, setRoundUp] = useState(false);
    const [customSplit, setCustomSplit] = useState(false);
    const [individuals, setIndividuals] = useState([]);
    const [perPerson, setPerPerson] = useState([]);
    const [summary, setSummary] = useState(null);
    const [activeTab, setActiveTab] = useState("splitter");

    const resetAll = () => {
        setTotal("");
        setPeople(2);
        setTip(0);
        setTax(0);
        setRoundUp(false);
        setCustomSplit(false);
        setIndividuals([]);
        setPerPerson([]);
        setSummary(null);
    };

    const calculateShare = () => {
        let base = parseFloat(total || 0);
        let tipAmt = (base * tip) / 100;
        let taxAmt = (base * tax) / 100;
        let totalAmount = base + tipAmt + taxAmt;

        if (customSplit && individuals.length === people) {
            const sumCustom = individuals.reduce(
                (a, b) => a + parseFloat(b || 0),
                0
            );
            if (sumCustom > 0) {
                const scale = totalAmount / sumCustom;
                const shares = individuals.map((amt) =>
                    roundUp
                        ? Math.ceil(parseFloat(amt || 0) * scale)
                        : parseFloat(amt || 0) * scale
                );
                setPerPerson(shares);
            }
        } else {
            const share = totalAmount / people;
            const finalShare = roundUp ? Math.ceil(share) : share;
            setPerPerson(Array(people).fill(finalShare));
        }

        setSummary({ base, tipAmt, taxAmt, totalAmount });
        setActiveTab("summary");
    };

    const handleIndividualChange = (index, value) => {
        const newValues = [...individuals];
        newValues[index] = value;
        setIndividuals(newValues);
    };

    const formatRupee = (value) =>
        new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(value);

    return (
        <div
            className={`min-h-screen flex flex-col items-center justify-start md:justify-center p-4 sm:p-6 transition-colors duration-500 ${dark ? "bg-gray-900 text-white" : "bg-white text-gray-900"
                }`}
        >
            {/* Theme Toggle */}
            <button
                onClick={() => setDark(!dark)}
                className="fixed top-4 right-4 p-3 rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition shadow-md z-10"
                aria-label="Toggle theme"
            >
                {dark ? <FaSun size={18} /> : <FaMoon size={18} />}
            </button>

            <div className="w-full max-w-3xl mt-4">
                {/* Header */}
                <div className="flex flex-col items-center mb-6">
                    <div className="flex items-center justify-center mb-4">
                        <div className="bg-indigo-100 dark:bg-indigo-900 p-3 rounded-full mr-3">
                            <FaCalculator className="text-indigo-600 dark:text-indigo-300 text-xl" />
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-center">
                            Advanced Bill Splitter
                        </h1>
                    </div>

                    {/* Tabs */}
                    <div className="flex w-full max-w-md bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                        <button
                            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${activeTab === "splitter"
                                    ? "bg-white dark:bg-gray-800 shadow-sm font-medium text-gray-900 dark:text-white"
                                    : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                }`}
                            onClick={() => setActiveTab("splitter")}
                        >
                            <FaCalculator className="mr-2" />
                            Splitter
                        </button>
                        <button
                            className={`flex-1 flex items-center justify-center py-2 px-4 rounded-md transition-colors ${activeTab === "summary"
                                    ? "bg-white dark:bg-gray-800 shadow-sm font-medium text-gray-900 dark:text-white"
                                    : "bg-transparent text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                                }`}
                            onClick={() => setActiveTab("summary")}
                        >
                            <FaReceipt className="mr-2" />
                            Summary
                        </button>
                    </div>
                </div>

                {/* Card Container */}
                <div
                    className={`w-full p-4 sm:p-6 md:p-8 rounded-xl shadow-lg transition-colors duration-500 ${dark ? "bg-gray-800" : "bg-white"
                        }`}
                >
                    {/* --- Splitter Content --- */}
                    {activeTab === "splitter" && (
                        <div className="space-y-5">
                            {/* Total Bill & People */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block font-medium mb-2 text-sm md:text-base">
                                        Total Bill (₹)
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-3 text-gray-500 dark:text-gray-400">
                                            ₹
                                        </span>
                                        <input
                                            type="number"
                                            value={total}
                                            onChange={(e) => setTotal(e.target.value)}
                                            className="w-full pl-8 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-base"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-medium mb-2 text-sm md:text-base">
                                        Number of People
                                    </label>
                                    <div className="flex items-center">
                                        <button
                                            className="bg-gray-200 dark:bg-gray-700 h-10 w-10 rounded-l-lg"
                                            onClick={() => people > 1 && setPeople(people - 1)}
                                            disabled={people <= 1}
                                        >
                                            -
                                        </button>
                                        <input
                                            type="number"
                                            value={people}
                                            min="1"
                                            onChange={(e) => {
                                                const val = Number(e.target.value);
                                                if (val > 0) {
                                                    setPeople(val);
                                                    setIndividuals(Array(val).fill(""));
                                                }
                                            }}
                                            className="w-16 text-center py-2 border-y border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 h-10"
                                        />
                                        <button
                                            className="bg-gray-200 dark:bg-gray-700 h-10 w-10 rounded-r-lg"
                                            onClick={() => setPeople(people + 1)}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Tip & Tax */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                    <label className="block font-medium mb-2 text-sm md:text-base">
                                        Tip (%) {tip > 0 && `(${formatRupee((total * tip) / 100)})`}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="30"
                                        value={tip}
                                        onChange={(e) => setTip(Number(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs mt-1">
                                        <span>0%</span>
                                        <span>{tip}%</span>
                                        <span>30%</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="block font-medium mb-2 text-sm md:text-base">
                                        Tax (%) {tax > 0 && `(${formatRupee((total * tax) / 100)})`}
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="20"
                                        value={tax}
                                        onChange={(e) => setTax(Number(e.target.value))}
                                        className="w-full"
                                    />
                                    <div className="flex justify-between text-xs mt-1">
                                        <span>0%</span>
                                        <span>{tax}%</span>
                                        <span>20%</span>
                                    </div>
                                </div>
                            </div>

                            {/* Options */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-3">
                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={roundUp}
                                        onChange={() => setRoundUp(!roundUp)}
                                    />
                                    Round Up Amount
                                </label>

                                <label className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={customSplit}
                                        onChange={() => setCustomSplit(!customSplit)}
                                    />
                                    Custom Split
                                </label>
                            </div>

                            {/* Custom Split Inputs */}
                            {customSplit && (
                                <div>
                                    <h3 className="font-medium mb-3">Individual Amounts</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {Array.from({ length: people }).map((_, i) => (
                                            <input
                                                key={i}
                                                type="number"
                                                value={individuals[i] || ""}
                                                onChange={(e) =>
                                                    handleIndividualChange(i, e.target.value)
                                                }
                                                placeholder={`Person ${i + 1}`}
                                                className="w-full p-2 border rounded-lg"
                                            />
                                        ))}
                                    </div>
                                    <p className="flex items-center mt-2 text-xs text-gray-500">
                                        <FaInfoCircle className="mr-1" /> Enter how much each person
                                        spent
                                    </p>
                                </div>
                            )}

                            {/* Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <button
                                    onClick={calculateShare}
                                    className="flex-1 bg-indigo-500 text-white py-3 rounded-lg"
                                    disabled={!total}
                                >
                                    <FaCalculator className="inline mr-2" /> Calculate
                                </button>
                                <button
                                    onClick={resetAll}
                                    className="flex-1 bg-gray-200 dark:bg-gray-700 py-3 rounded-lg"
                                >
                                    <FaRedoAlt className="inline mr-2" /> Reset
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- Summary Content --- */}
                    {activeTab === "summary" && (
                        <div>
                            {summary ? (
                                <>
                                    <h2 className="text-xl font-bold text-center mb-4">
                                        Bill Summary
                                    </h2>
                                    <p className="text-center text-gray-500 dark:text-gray-400 mb-6">
                                        Breakdown of your bill
                                    </p>

                                    {/* Summary */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700">
                                            <h3 className="font-medium mb-3">Bill Details</h3>
                                            <p>Base: {formatRupee(summary.base)}</p>
                                            <p>Tip: {formatRupee(summary.tipAmt)}</p>
                                            <p>Tax: {formatRupee(summary.taxAmt)}</p>
                                            <p className="font-bold mt-2">
                                                Total: {formatRupee(summary.totalAmount)}
                                            </p>
                                        </div>
                                        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700">
                                            <h3 className="font-medium mb-3">Split Details</h3>
                                            <p>People: {people}</p>
                                            <p>Custom Split: {customSplit ? "Yes" : "No"}</p>
                                            <p>Round Up: {roundUp ? "Yes" : "No"}</p>
                                        </div>
                                    </div>

                                    {/* Per Person */}
                                    {perPerson.length > 0 && (
                                        <div className="p-4 rounded-xl bg-gray-100 dark:bg-gray-700 mb-6">
                                            <h3 className="font-medium mb-3 text-center">
                                                Per Person Share
                                            </h3>
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {perPerson.map((amt, i) => (
                                                    <p
                                                        key={i}
                                                        className="flex justify-between bg-white dark:bg-gray-800 p-2 rounded-lg"
                                                    >
                                                        Person {i + 1}:{" "}
                                                        <span className="font-bold">
                                                            {formatRupee(amt)}
                                                        </span>
                                                    </p>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <div className="text-center">
                                        <button
                                            onClick={() => setActiveTab("splitter")}
                                            className="px-6 py-2 bg-indigo-500 text-white rounded-lg"
                                        >
                                            Back to Splitter
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-center py-10">
                                    <FaReceipt className="mx-auto text-4xl text-indigo-500 mb-3" />
                                    <p>No Calculation Yet</p>
                                    <button
                                        onClick={() => setActiveTab("splitter")}
                                        className="mt-4 px-6 py-2 bg-indigo-500 text-white rounded-lg"
                                    >
                                        Go to Splitter
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BillSplitter;
