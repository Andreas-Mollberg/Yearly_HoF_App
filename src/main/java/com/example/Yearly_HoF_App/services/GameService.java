package com.example.Yearly_HoF_App.services;

import com.example.Yearly_HoF_App.models.Game;
import com.example.Yearly_HoF_App.repositories.GameRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GameService {

    @Autowired
    private GameRepository gameRepository;

    public List<Game> getAllGames() {
        return gameRepository.findAll();
    }

    public Game getGameById(Long id) {
        return gameRepository.findById(id).orElse(null);
    }

    public Game addGame(Game game) {
        return gameRepository.save(game);
    }

    public Game updateGame(Long id, Game gameDetails) {
        Game game = gameRepository.findById(id).orElse(null);
        if (game != null) {
            game.setTitle(gameDetails.getTitle());
            game.setDeveloper(gameDetails.getDeveloper());
            game.setPublisher(gameDetails.getPublisher());
            game.setReleaseYear(gameDetails.getReleaseYear());
            game.setReleaseDate(gameDetails.getReleaseDate());
            game.setPersonalScore(gameDetails.getPersonalScore());
            game.setPersonalThoughts(gameDetails.getPersonalThoughts());
            return gameRepository.save(game);
        }
        return null;
    }

    public void deleteGame(Long id) {
        gameRepository.deleteById(id);
    }
}
