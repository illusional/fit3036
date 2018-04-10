import axios from 'axios';

export default class CalculationApi {

    static loadData(left, bottom, right, top) {
        const url = `/api/calculate?bbox=${left},${bottom},${right},${top}`;
        return axios.post(url, res => {
            const { data } = res;
            if (data.success) {
                return data;
            } else {
                throw new Error(data.message);
            }
        });

    }

}