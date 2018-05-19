import axios from 'axios';

export default class CalculationApi {

    static loadData(left, bottom, right, top, roadOption) {
        const url = `/api/calculate?bbox=${left},${bottom},${right},${top}&roadOption=${roadOption || "truncate"}`;
        return axios.post(url, res => {
            const { data } = res;
            if (data.success) {
                return data;
            } else {
                throw new Error(data ? data.message : res.message);
            }
        });
    }
}