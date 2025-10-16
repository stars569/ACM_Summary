import { linearChartData, linearChartDataType, questionDataFeedback } from "./types";

export function getChart(data: questionDataFeedback[]): linearChartData{
    if(data.length === 0)return {ave: [], count: []}
    data.sort((a,b) => new Date(a.solvetime).getTime() - new Date(b.solvetime).getTime())
    const res: linearChartData = {
        ave: [],
        count: []
    }
    const aveData: linearChartDataType[] = []
    const countData: linearChartDataType[] = []
    var date = new Date(data[0]?.solvetime).getTime()
    var count = 0
    var totalDiff = 0
    for(let i = 0; i < data.length; i++){
        const newDate = new Date(data[i].solvetime).getTime()
        if(date != newDate){
            const dataAve: linearChartDataType = {
                name: new Date(data[i - 1].solvetime).toLocaleDateString(),
                pv: 1.0 * totalDiff / count,
                amt: 0
            }
            const datacount: linearChartDataType = {
                name: new Date(data[i - 1].solvetime).toLocaleDateString(),
                pv: count,
                amt: 0
            }
            aveData.push(dataAve)
            countData.push(datacount)
            date = newDate
            count = 1
            totalDiff = data[i].difficulty
        }
        else{
            count++;
            totalDiff += data[i].difficulty
        }
    }
    const dataAve:linearChartDataType = {
        name: new Date(data[data.length - 1]?.solvetime).toLocaleDateString(),
        pv: totalDiff / count,
        amt: 0
    }
    const datacount:linearChartDataType = {
        name: new Date(data[data.length - 1]?.solvetime).toLocaleDateString(),
        pv: count,
        amt: 0
    }
    aveData.push(dataAve)
    countData.push(datacount)
    res.ave = aveData
    res.count = countData
    return res
}

export function cleanQuestionData(data: questionDataFeedback[], difficulty: number){
    const res: questionDataFeedback[] = []
    for(var i=0;i<data.length;++i){
        if(data[i].difficulty >= difficulty){
            res.push(data[i])
        }
    }
    return res
}

export function memoryToDay(memoryRound: number){
    if(memoryRound === 0)return 1
    else if(memoryRound === 1)return 2
    else if(memoryRound === 2)return 4
    else if(memoryRound === 3)return 7
    else if(memoryRound === 4)return 15
    else return Infinity
}