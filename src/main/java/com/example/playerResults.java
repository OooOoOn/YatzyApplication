package com.example;

/**
 * Created by OooOoOn on 11/03/2017.
 */
public class playerResults {

    public int roundID;
    public int turn;
    public String name;
    public String result;
    public String combination;
    public int points;

    public playerResults(int roundID, int turn, String name, String result, String combination, int points) {
        this.roundID = roundID;
        this.turn = turn;
        this.name = name;
        this.result = result;
        this.combination = combination;
        this.points = points;
    }

}
