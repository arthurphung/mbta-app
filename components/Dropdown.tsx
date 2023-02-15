import { useState, useEffect, useRef, ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faXmark } from '@fortawesome/free-solid-svg-icons';
import styles from '../styles/Dropdown.module.css';
import { IDropdownOption } from '../interfaces/IDropdownOption';
import cx from 'classnames';

interface DropdownProps {
    placeholder: string,
    options: Array<IDropdownOption>,
    isMulti: Boolean,
    isSearchable: Boolean,
    onChange: Function,
    layer: string
}

export default function Dropdown(props: DropdownProps) {
    const [showMenu, setShowMenu] = useState<Boolean>(false);
    const [selectedValue, setSelectedValue] = useState<Array<IDropdownOption> | IDropdownOption>(props.isMulti ? [] : { 'value': '', 'label': '' });
    const [searchValue, setSearchValue] = useState<string>('');
    const searchRef = useRef<HTMLInputElement>(null);
    const inputRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setSearchValue('');
        if (showMenu && searchRef.current) {
            searchRef.current.focus();
        }
    }, [showMenu]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (inputRef.current && !inputRef.current.contains(e.target as Node)) {
                setShowMenu(false);
            }
        } 

        window.addEventListener('click', handler);
        return () => {
            window.removeEventListener('click', handler);
        };
    });

    const handleInputClick = () => {
        setShowMenu(!showMenu);
    }

    const displaySelection = () => {
        if (Array.isArray(selectedValue)) {
            if (selectedValue.length === 0) {
                return props.placeholder;
            }
        } else if (typeof(selectedValue) === 'object') {
            if (!selectedValue.label.length) {
                return props.placeholder;
            } else {
                return selectedValue.label;
            }
        }

        if (props.isMulti && Array.isArray(selectedValue)) {
            return (
                <div className={styles['dropdown-tags']}>
                    {selectedValue.map((option) => {
                        return (
                            <div key={option.value} className={styles['dropdown-tag-item']}>
                                <div className={styles['dropdown-tag-label']}>
                                    {option.label}
                                </div>
                                <div onClick={(e) => onTagRemove(e, option)} className={styles['dropdown-tag-close']}>
                                    <FontAwesomeIcon icon={faXmark} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            );
        }
    };

    const onOptionClick = (option: IDropdownOption) => {
        let newValue; 
        if (props.isMulti && Array.isArray(selectedValue)) {
            if (selectedValue.findIndex((el) => el.value === option.value) >= 0) {
                newValue = removeOption(option);
            } else {
                newValue = [...selectedValue, option];
            }
        } else {
            newValue = option;
        }
        setSelectedValue(newValue);
        props.onChange(newValue);
    };

    const removeOption = (option: IDropdownOption): Array<IDropdownOption> => {
        if (Array.isArray(selectedValue)) {
            return selectedValue.filter((el) => el.value !== option.value);
        }
        return [];
    };

    const onTagRemove = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, option: IDropdownOption) => {
        e.stopPropagation();
        if (Array.isArray(selectedValue)) {
            const newValue = removeOption(option);
            setSelectedValue(newValue);
            props.onChange(newValue);
        }
    };

    const isSelected = (option: IDropdownOption) => {
        if (Array.isArray(selectedValue)) {
            return selectedValue.filter((el) => el.value === option.value).length > 0;
        }

        if (typeof(selectedValue) === 'object') {
            if (!selectedValue.value.length) {
                return false;
            }
        }

        return selectedValue.value === option.value;
    }

    const onSearch = (e: ChangeEvent<HTMLInputElement>) => {
        setSearchValue(e.target.value);
    }

    const getOptions = () => {
        if (!searchValue) {
            return props.options;
        }

        return props.options.filter((option) => option.label.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0);
    }

    const getLayer = () => {
        switch (props.layer) {
            case 'first':
                return styles.first;
            case 'second':
                return styles.second;
            case 'third':
                return styles.third;
            default:
                break;
        }
    }

    return (
        <motion.div animate={showMenu ? 'open' : 'closed'} className={cx(styles['dropdown-container'], getLayer())}>
            <div ref={inputRef} className={styles['dropdown-input']} onClick={handleInputClick}>
                <div className='dropdown-selected-value'>{displaySelection()}</div>
                <motion.div 
                    variants={{
                        open: { rotate: 180 },
                        closed: { rotate: 0 }
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ originY: 0.55 }}
                >
                    <FontAwesomeIcon icon={faAngleDown} />
                </motion.div>
            </div>
            {showMenu &&
                <div className={styles['dropdown-menu']}>
                    {props.isSearchable && 
                        <div className={styles['search-box']}>
                            <input onChange={onSearch} value={searchValue} ref={searchRef} />
                        </div>
                    }
                    {getOptions().map((option) => {
                        return (
                            <div
                                key={option.value} 
                                className={isSelected(option) ? cx(styles['dropdown-item'], styles.selected) : styles['dropdown-item']}
                                onClick={() => onOptionClick(option)}
                            >
                                {option.label}
                            </div>
                        );
                    })}
                </div>
            }
        </motion.div>
    );
};