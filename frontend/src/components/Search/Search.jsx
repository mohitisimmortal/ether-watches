import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Search.css'

const Search = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const wrapperRef = useRef(null);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', handleCloseOnScroll, true); // true for capturing phase
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('scroll', handleCloseOnScroll, true);
        };
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('search-open');
        } else {
            document.body.classList.remove('search-open');
        }
    }, [isOpen]);


    const handleClickOutside = (event) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    const handleCloseOnScroll = () => {
        setIsOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate(`/watches?search=${searchTerm}`);
        }
        setIsOpen(false); // close on enter
        document.body.classList.remove('search-open'); // Ensure this class is removed immediately

    };

    return (
        <div ref={wrapperRef}>
            <div className={`search-icon ${isOpen ? 'open' : ''}`} onClick={() => setIsOpen(!isOpen)}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M10 6.5C10 8.433 8.433 10 6.5 10C4.567 10 3 8.433 3 6.5C3 4.567 4.567 3 6.5 3C8.433 3 10 4.567 10 6.5ZM9.30884 10.0159C8.53901 10.6318 7.56251 11 6.5 11C4.01472 11 2 8.98528 2 6.5C2 4.01472 4.01472 2 6.5 2C8.98528 2 11 4.01472 11 6.5C11 7.56251 10.6318 8.53901 10.0159 9.30884L12.8536 12.1464C13.0488 12.3417 13.0488 12.6583 12.8536 12.8536C12.6583 13.0488 12.3417 13.0488 12.1464 12.8536L9.30884 10.0159Z" fill="currentColor" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
            </div>
            <div className={`search-input-wrapper ${isOpen ? 'open' : ''}`}>
                <form onSubmit={handleSearch}>
                    <input
                        type='text'
                        placeholder='Search watches...'
                        className='search-input'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onBlur={() => { if (!searchTerm) setIsOpen(false); }}
                    />
                </form>
            </div>
        </div>
    );
};

export default Search;