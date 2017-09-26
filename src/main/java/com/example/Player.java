package com.example;

/**
 * Created by OooOoOn on 27/12/2016.
 */
public class Player {

    private String name;
    private int score;



    public Player(String name, int score) {
        this.name = name;
        this.score = score;

    }

    public String getName() {
        return name;
    }

    public int getScore() {
        return score;
    }

}