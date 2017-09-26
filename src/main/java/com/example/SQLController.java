package com.example;

import org.springframework.web.bind.annotation.*;
import org.springframework.stereotype.Controller;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.sql.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * Created by OooOoOn on 04/03/2017.
 */

@CrossOrigin(origins = "*")
@RestController
public class SQLController {

    PreparedStatement pstmt = null;
    CallableStatement cstmt = null;
    Connection conn = null;
    List<Player> players = new ArrayList<>();
    List<String> highscore = new ArrayList<>();
    String name = "";
    Random rand = new Random();
    int roundID = rand.nextInt(500);
    List<playerResults> playerResult = new ArrayList<>();
    List<roundStatistics> roundStatistics = new ArrayList<>();
    StringBuilder temp = new StringBuilder();  // needed for result after every throw


    /**
     *
     * //Method to display highscore.
     *
     */

    @RequestMapping(value = "/highscore", method = RequestMethod.GET)
    public List<Player> highscore() throws SQLException {

        players.clear();

        try {
            conn = DriverManager.getConnection("jdbc:sqlserver://OOOOOON-PC:1433;databaseName=ECYatzy;user=jon2;password=test123");
        } catch (SQLException e) {
            e.printStackTrace();
        }

        try {

            PreparedStatement pstmt = conn.prepareStatement("SELECT Name, Score FROM dbo.Player INNER JOIN dbo.Listofrounds ON dbo.Listofrounds.PlayerID = dbo.Player.PlayerID ORDER BY Score desc");
            ResultSet rs = pstmt.executeQuery();


            while (rs.next()) {
                name = rs.getString("Name");
                int score = rs.getInt("Score");
                players.add(new Player(name, score));


            }


        } catch (SQLException e) {
            e.printStackTrace();
        }

        return players;


    }


    /**
     *
     * method to show specific player and its rounds etc.
     *
     *
     */

    @RequestMapping(value = "/person", method = RequestMethod.GET)
    public List<playerResults> playerResult(@RequestParam String name) throws SQLException {

        playerResult.clear();

        try {
            conn = DriverManager.getConnection("jdbc:sqlserver://OOOOOON-PC:1433;databaseName=ECYatzy;user=jon2;password=test123");
        } catch (SQLException e) {
            e.printStackTrace();
        }


        try {


            pstmt = conn.prepareStatement("SELECT RoundID, Name, Combination, Points, Turn, Result FROM dbo.Turn WHERE Name = ?");
            pstmt.setString(1, name);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                name = rs.getString("Name");
                String combination = rs.getString("Combination");
                int points = rs.getInt("Points");
                int turn = rs.getInt("Turn");
                int roundID = rs.getInt("RoundID");
                String result = rs.getString("Result");

                playerResult.add(new playerResults(roundID, turn, name, result, combination, points));
            }


        } catch (SQLException e) {
            e.printStackTrace();
        }

        return playerResult;


    }


    @RequestMapping(value = "/roundID", method = RequestMethod.GET)
    public List<roundStatistics> roundStatistics(@RequestParam String roundChoice) throws SQLException {

        roundStatistics.clear();

        int convertedRoundChoice = Integer.parseInt(roundChoice);

        try {
            conn = DriverManager.getConnection("jdbc:sqlserver://OOOOOON-PC:1433;databaseName=ECYatzy;user=jon2;password=test123");
        } catch (SQLException e) {
            e.printStackTrace();
        }


        try {

            PreparedStatement pstmt = conn.prepareStatement("SELECT RoundID, Winner, Looser, Date, WinnerScore FROM dbo.Round WHERE RoundID = ?");
            pstmt.setInt(1, convertedRoundChoice);
            ResultSet rs = pstmt.executeQuery();
            while (rs.next()) {
                String winner = rs.getString("Winner");
                String looser = rs.getString("Looser");
                String date = rs.getString("Date");
                int winnerScore = rs.getInt("WinnerScore");
                int roundID = rs.getInt("RoundID");

                roundStatistics.add(new roundStatistics(winner, looser, date, winnerScore, roundID));

            }


        } catch (SQLException e) {
            e.printStackTrace();
        }


        return roundStatistics;


    }


    /**
     * insert player names to highscore list.
     */


    @RequestMapping(value = "/insertPlayers", method = RequestMethod.GET)
    public void insertPlayers(@RequestParam String name1, @RequestParam String score1, @RequestParam String name2, @RequestParam String score2) throws SQLException {

        try {
            conn = DriverManager.getConnection("jdbc:sqlserver://OOOOOON-PC:1433;databaseName=ECYatzy;user=jon2;password=test123");
        } catch (SQLException e) {
            e.printStackTrace();
        }

        Player[] players = new Player[2];
        players[0] = new Player(name1, Integer.parseInt(score1));
        players[1] = new Player(name2, Integer.parseInt(score2));
        try {


            cstmt = conn.prepareCall("{call dbo.Player_SP(?)}");
            for (int i = 0; i < players.length; i++) {
                cstmt.setString(1, players[i].getName());

                cstmt.execute();
            }


        } catch (
                SQLException e)

        {
            e.printStackTrace();
        }

        /**
         *
         *requesting both player ID's as we need them
         *
         */


        try {

            pstmt = conn.prepareStatement("SELECT PlayerID FROM dbo.Player", ResultSet.TYPE_SCROLL_INSENSITIVE, ResultSet.CONCUR_READ_ONLY);
            ResultSet rs = pstmt.executeQuery();

            rs.afterLast();
            System.out.println(2);

            for (int i = (2 - 1); i != -1; i--) {
                rs.previous();

                int playerID = rs.getInt("PlayerID");


                pstmt = conn.prepareStatement("INSERT INTO dbo.Listofrounds (RoundID, PlayerID, Score) VALUES (?, ?, ?)");


                pstmt.setInt(1, roundID);
                pstmt.setInt(2, playerID);
                pstmt.setInt(3, players[i].getScore());
                pstmt.executeUpdate();


            }


        } catch (SQLException e) {
            e.printStackTrace();
        }


    }

    /**
     *
     *
     * insert player scores to database
     *
     *
     */


    @RequestMapping(value = "/insertScore", method = RequestMethod.GET)
    public void insertScore(@RequestParam int points, @RequestParam String combination, @RequestParam String name, @RequestParam String result, @RequestParam int currentTurn) throws SQLException {

        try {
            conn = DriverManager.getConnection("jdbc:sqlserver://OOOOOON-PC:1433;databaseName=ECYatzy;user=jon2;password=test123");
        } catch (SQLException e) {
            e.printStackTrace();
        }

        pstmt = conn.prepareStatement("INSERT INTO dbo.Turn (Points, Combination, Name, Result, roundID, Turn) VALUES (?, ?, ?, ?, ?, ?)");


        pstmt.setInt(1, points);
        pstmt.setString(2, combination);
        pstmt.setString(3, name);
        pstmt.setString(4, result);
        pstmt.setInt(5, roundID);
        pstmt.setInt(6, currentTurn);

        pstmt.executeUpdate();


        temp.setLength(0);


    }



    /**
     *
     * method to show all results relating to a specific round.
     *
     *
     */

    @RequestMapping(value = "/insertRoundStatistics", method = RequestMethod.GET)
    public void insertRoundStatistics(@RequestParam String winner, @RequestParam String looser, @RequestParam int winnerScore) throws SQLException {

        try {
            conn = DriverManager.getConnection("jdbc:sqlserver://OOOOOON-PC:1433;databaseName=ECYatzy;user=jon2;password=test123");
        } catch (SQLException e) {
            e.printStackTrace();
        }


        try {


            cstmt = conn.prepareCall("{call dbo.Round_SP(?, ?, ?, ?, ?)}");


            cstmt.setString(2, winner);
            cstmt.setInt(5, winnerScore);
            cstmt.setInt(1, roundID);
            cstmt.setString(3, looser);
            LocalDateTime currentTime = LocalDateTime.now();
            LocalDate date1 = currentTime.toLocalDate();
            cstmt.setDate(4, Date.valueOf(date1));


            cstmt.execute();

        } catch (SQLException e) {
            e.printStackTrace();
        }


    }


}