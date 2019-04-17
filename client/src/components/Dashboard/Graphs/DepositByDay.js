import React from 'react';
import Plot from 'react-plotly.js';
import _ from "underscore";
import moment from "moment";
import { Redirect } from 'react-router';

import { withAuthUserContext } from "../../Auth/Session/AuthUserContext";

class DepositByDay extends React.Component {    
    plotDeposits = (uid) => {
        const selectorOptions = {
            buttons: [
            {
                step: 'day',
                stepmode: 'backward',
                count: 1,
                label: '1d'
            }, {
                step: 'month',
                stepmode: 'backward',
                count: 1,
                label: '1m'
            }, {
                step: 'month',
                stepmode: 'backward',
                count: 6,
                label: '6m'
            }, {
                step: 'year',
                stepmode: 'todate',
                count: 1,
                label: 'YTD'
            }, {
                step: 'year',
                stepmode: 'backward',
                count: 1,
                label: '1y'
            }, {
                step: 'all',
            }]
        };
    
        const sortedByDate = this.props.deposits.sort((a, b) => {
            return  (a.time > b.time) ? 1 : -1;
        });

        // split deposits by day into object with all deposits for each day
        let groups = _.groupBy(sortedByDate, (deposit) => {
            let jsDate = new Date(deposit.time);
            return moment(jsDate).startOf('day').format();
        });

        // turn complex object into array by day with total for the day and each days deposits (for stacking later)
        var dayDeposits = _.map(groups, (deposit, day) => {
            let totalObj = deposit.reduce((a, b) => {
                return({amount: a.amount + b.amount});
            });
            let total = totalObj.amount;
            return {
                day: day,
                total: total,
                times: deposit
            };
        });
        console.log(dayDeposits);

        // convert to javascript date object so plotly can recognize it as a proper date
        const days = dayDeposits.map((deposit) => {
            let jsDate = new Date(deposit.day);
            // Convert to just day without time
            let month = '' + (jsDate.getMonth() + 1);
            let day = '' + jsDate.getDate();
            let year = jsDate.getFullYear();
    
            if (month.length < 2) month = '0' + month;
            if (day.length < 2) day = '0' + day;
    
            return [year, month, day].join('-');
        });

        const earliestDate = days.length > 0 ? days[0] : new Date();
        const latestDate = days.length > 0 ? days[days.length-1] : new Date();

        const amounts = dayDeposits.map((deposit) => {
            return (deposit.total); 
        });

        // STILL NEED To stack all deposits for that day

        return (
            <Plot
            data= {[
                {
                    type: 'bar',
                    mode: 'stack',
                    name: 'Deposits by User',
                    x: days,
                    y: amounts,
                    marker: {color: 'blue'},
                    "hoverinfo": "x+y",
                    "line": {"width": 0.5}, 
                },
            ]}
            layout = {
                {
                    autosize: true,
                    /* title: 'Deposits By User' */
                    xaxis: {
                        autorange: true,
                        range: [earliestDate, latestDate],
                        rangeselector: selectorOptions,
                        rangeslider: {earliestDate, latestDate},
                      }          
                }
            }
            useResizeHandler = {true}
            style = {{width: "100%", height: "100%"}}
            />
        );  
    }
  
    render() {
        // Some props take time to get ready so return null when uid not avaialble
        if (!this.props.user) {
            return null;
        }
  
        if (this.props.user.authUser) {
            return ( 
                <div>
                    <div className="col s12 m6">
                        <div className="card">
                            <div className="card-content pCard">
                            <span className="card-title">{this.props.title ? this.props.title : 'DepositByDay'}</span>
                            {this.plotDeposits()}
                            </div>
                            <div className="card-action pCard">
                                <div className="center-align">
                                    <a href="#!" className="waves-effect waves-light dash-btn blue darken-4 btn">More Details</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            );
        } else  {                
            return (
                <Redirect to="/signin" />
            );      
        }
    }
}

export default withAuthUserContext(DepositByDay);