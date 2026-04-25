package game;

import java.util.Arrays;

public class GameState {

    private final Cell[] cells;
    private final String currentPlayer;
    private final String winner;
    private final boolean hasHistory;

    private GameState(Cell[] cells, String currentPlayer, String winner, boolean hasHistory) {
        this.cells = cells;
        this.currentPlayer = currentPlayer;
        this.winner = winner;
        this.hasHistory = hasHistory;
    }

    public static GameState forGame(Game game) {
        Cell[] cells = getCells(game);
        String currentPlayer = game.getPlayer() == Player.PLAYER0 ? "X" : "O";
        Player w = game.getWinner();
        String winner = w == null ? null : (w == Player.PLAYER0 ? "X" : "O");
        boolean hasHistory = game.hasHistory();
        return new GameState(cells, currentPlayer, winner, hasHistory);
    }

    @Override
    public String toString() {
        String winnerStr = this.winner == null ? "null" : "\"" + this.winner + "\"";
        return """
                { "cells": %s, "currentPlayer": "%s", "winner": %s, "hasHistory": %b }
                """.formatted(Arrays.toString(this.cells), this.currentPlayer, winnerStr, this.hasHistory);
    }

    private static Cell[] getCells(Game game) {
        Cell[] cells = new Cell[9];
        Board board = game.getBoard();
        boolean gameOver = game.getWinner() != null;
        for (int x = 0; x <= 2; x++) {
            for (int y = 0; y <= 2; y++) {
                String text = "";
                boolean playable = false;
                Player player = board.getCell(x, y);
                if (player == Player.PLAYER0) text = "X";
                else if (player == Player.PLAYER1) text = "O";
                else if (!gameOver) playable = true;
                cells[3 * y + x] = new Cell(x, y, text, playable);
            }
        }
        return cells;
    }
}

class Cell {
    private final int x;
    private final int y;
    private final String text;
    private final boolean playable;

    Cell(int x, int y, String text, boolean playable) {
        this.x = x;
        this.y = y;
        this.text = text;
        this.playable = playable;
    }

    public int getX() { return x; }
    public int getY() { return y; }
    public String getText() { return this.text; }
    public boolean isPlayable() { return this.playable; }

    @Override
    public String toString() {
        return """
                { "text": "%s", "playable": %b, "x": %d, "y": %d }
                """.formatted(this.text, this.playable, this.x, this.y);
    }
}