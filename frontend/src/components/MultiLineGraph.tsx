import React from 'react'
import {graphPoint} from "./TopCurrencyGraph"

interface propsType {
    map : {[name : string] : graphPoint[]}
}

const MultiLineGraph = (props : propsType) => {
    const {map} = props
    return (
        <div>
            
        </div>
    )
}

export default MultiLineGraph
