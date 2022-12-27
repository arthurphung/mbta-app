type RoutesObj = {
    id: string,
    list: Array<string>
};

interface SelectMenuProps {
    data: Array<RoutesObj>
}

export default function SelectMenu(props: SelectMenuProps) {
    return (
        <div className='custom-grouped-select'>
            <select>
                {props.data.map((el, idx) => {
                    return (
                        <optgroup
                            key={el.id}
                            label={el.id}
                        >
                            {el.list.map((route, idx) => {
                                return (
                                    <option
                                        key={idx}
                                    >
                                        {route}
                                    </option>
                                );
                            })}
                        </optgroup>
                    );
                })}
            </select>
        </div>
    );
};