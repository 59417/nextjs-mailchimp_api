import { Fragment } from 'react';
import classes from './Layout.module.scss';

export default function Layout (props) {
    const isAuto = props.isAuto;
    const handleSwitch = props.handleSwitch;

    return (
        <Fragment>
            <div className={classes.btn_wrapper}>
                <button 
                    id={classes.left}
                    disabled={isAuto}
                    onClick={handleSwitch}
                >
                    {!isAuto&&'<'} Auto<br/>Execution
                </button>

                <button 
                    id={classes.right}
                    disabled={!isAuto}
                    onClick={handleSwitch}
                >
                    Manual<br/>Execution {isAuto&&'>'}
                </button>
            </div>
            {props.children}
        </Fragment>
    )
};