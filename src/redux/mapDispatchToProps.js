import { BASE_URL } from '../data/baseURL'
import axios from 'axios'

const mapDispatchToProps = (dispatch) => {
    return {

        start: () => { dispatch({type: "CHANGE_ACTIVE", payload: true}) },
        stop: () => { dispatch({type: "CHANGE_ACTIVE", payload: false}) },
        clear: () => { dispatch({type: "CLEAR_CANVAS"}) },
        setNewBody: (event) => { dispatch({type: "SET_NEW_BODY", payload: event}) },
        setName: (event) => { dispatch({type: "SET_NAME", payload: event}) },
        setPos: (pos) => { dispatch({type: "SET_POS", payload: pos}) },
        setNewBodyPos: (event) => { dispatch({type: "SET_NEW_BODY_POS", payload: event}) },
        setNewBodyVel: (event) => { dispatch({type: "SET_NEW_BODY_VEL", payload: event}) },
        setNewBodyVelOnContextmenue: (vel) => { dispatch({type: "SET_NEW_BODY_VEL_CONTEXTMENUE", payload: vel}) },
        setNewBodyVelKg: (event) => { dispatch({type: "SET_NEW_BODY_VEL_KG", payload: event}) },
        setNewBodyHasTail: (event) => { dispatch({type: "SET_NEW_BODY_HAS_TAIL", payload: event}) },
        setBody: (body) => { dispatch({type: "SET_BODY", payload: body}) },
        clearBody: () => { dispatch({type: "CLEAR_BODY"}) },
        countUP: () => { dispatch({type: "COUNT_UP"}) },
        countDOWN: () => { dispatch({type: "COUNT_DOWN"}) },
        countClear: () => { dispatch({type: "COUNT_CLEAR"}) },
        setCount: (count) => { dispatch({type: "SET_COUNT", payload: count}) },       
        setRandom: (event) => { dispatch({type: "SET_RANDOM", payload: event}) },
        setObjects: (event) => { dispatch({type: "SET_OBJECTS", payload: event}) },
        saveObjects: (objects) => { dispatch(() => {
            axios.post(BASE_URL+"/objects/add", objects)
                .then((response) => {
                    dispatch({type: "ADD_OBJECTS", payload: objects})
                })
        })},
        getObjects: () => { dispatch(() => {
            axios.get(BASE_URL+"/objects/")
                .then((response) => {
                    //console.log(response.data);
                    dispatch({type: "GET_OBJECTS", payload: response.data})
                })
        })},
        setSetting: (event) => { dispatch({type: "SET_SETTING", payload: event}) },
        setRatio: (ratio) => { dispatch({type: "SET_RATIO", payload: ratio}) }
    }
}

export default mapDispatchToProps