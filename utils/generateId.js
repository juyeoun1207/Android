import uuid from 'react-native-uuid';

const generateId = () => {
    // return Math.random().toString(16).slice(2)
    return uuid.v4();
}

export default generateId