import { serverURL } from './index'
import AsyncStorage from '@react-native-async-storage/async-storage';

const storeData = async (value) => {
    try {
        await AsyncStorage.setItem('@UUID', JSON.stringify(value));
        return JSON.stringify(value);
    } catch (e) {
        console.log("Error writing UUID: " + e)
    }
}

export async function checkForUUID() {
    
    const getData = async () => {
        try {
            const value = await AsyncStorage.getItem('@UUID')
            if(value !== null) {
                return value;
            }else{
                fetch(serverURL + '/uuidAPI', {
                    method: 'POST'
                })
                .then(response => response.json())
                .then(data => {
                    storeData(data);
                })
                    
            }
        } catch(e) {
            console.log("Error reading UUID: " + e)
        }
    }
    return new Promise((resolve, reject) => {
        getData().then((response) => {
            resolve(response);
        }).catch((e) => {
            reject();
        });
        
    })
    
}
