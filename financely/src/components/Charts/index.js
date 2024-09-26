import React, { useRef } from 'react';
import { Line , Pie} from '@ant-design/charts';

function ChartComponents({ sortedTransactions }) {
  const chartRef = useRef(null); // Initialize chartRef with useRef

  // Map the data to have date and amount for the chart
  const data = sortedTransactions.map((item) => ({
    date: item.date,
    amount: item.amount,
  }));

  const spendingData= sortedTransactions.filter(
    (transaction)=>{if(transaction.type=="expense"){
       return {tag: transaction.tag, amount: transaction.ampunt}
    }}
);

let finalSpendings = spendingData.reduce((acc, obj) =>{
 let key = obj.tag;
 if(!acc[key]){
    acc[key] = {tag: obj.tag, amount: obj.amount};
 }
 else{
    acc[key].amount += obj.amount;
 }
return acc;
 }, {});

 let newSpendings= [
    { tag: "food", amount: 0},
    { tag: "education", amount: 0},
    { tag: "office", amount: 0},
    { tag: "travel", amount: 0},

 ];

 spendingData.forEach((item)  => {
    if(item.tag == "food"){
        newSpendings[0].amount += item.amount;
    }
    else if(item.tag == "education"){
        newSpendings[1].amount += item.amount;
    }
    else if(item.tag == "office"){
        newSpendings[2].amount += item.amount;
    }
    else{
        newSpendings[3].amount += item.amount;
    }
 });

  const config = {
    data:data,
    width: 600,
    autoFit: true, // Automatically adjust the chart size
    xField: 'date', // Correct xField name
    yField: 'amount', // Correct yField name

  };
  const spendingConfig = {
    data: newSpendings,
    width: 500,
    angleField: "amount",
    colorField: "tag",

  };
  let chart;
  let pieChart;

  return (
    <div className="charts-wrapper">
        <div>
            <h2 style={{marginTop:0}}>Your Analytics</h2>
      <Line 
      style={{width:"50%"}}
        {...config} 
        onReady={(chartInstance) => (chart = chartInstance)} // Store the chart instance in ref
      />
         </div>
         <div>
            <h2>Your Spendings</h2>
           <Pie {...spendingConfig} 
        onReady={(chartInstance) => (pieChart = chartInstance)}/>
         </div>
    </div>
  );
}

export default ChartComponents;


