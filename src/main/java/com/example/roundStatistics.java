package com.example;

/**
 * Created by OooOoOn on 12/03/2017.
 */
public class roundStatistics {

    public String winner;
    public String looser;
    public String date;
    public int winnerScore;
    public int roundID;

    public roundStatistics(String winner, String looser, String date, int winnerScore, int roundID){
        this.winner = winner;
        this.looser = looser;
        this.date = date;
        this.winnerScore = winnerScore;
        this.roundID = roundID;
    }
}
