package com.example.Yearly_HoF_App.controllers;

import com.example.Yearly_HoF_App.models.Game;
import com.example.Yearly_HoF_App.repositories.GameRepository;
import com.example.Yearly_HoF_App.services.GameService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/games")
public class GameController {

    @Autowired
    private GameService gameService;

    @Autowired
    private GameRepository gameRepository;

    @GetMapping
    public List<Game> getAllGames() {
        return gameService.getAllGames();
    }

    @GetMapping("/{id}")
    public Game getGameById(@PathVariable Long id) {
        return gameService.getGameById(id);
    }

    @PostMapping
    public Game addGame(@RequestBody Game game) {
        return gameService.addGame(game);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Game> updateGame(@PathVariable Long id, @RequestBody Game updatedGame) {
        Optional<Game> gameOptional = gameRepository.findById(id);
        if (!gameOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        updatedGame.setId(id);

        Game savedGame = gameRepository.save(updatedGame);
        return ResponseEntity.ok(savedGame);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteGame(@PathVariable Long id) {
        if (!gameRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        gameRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filter")
    public List<Game> getGamesByYear(@RequestParam(required = false) Integer year, @RequestParam(required = false) Integer limit) {
        if (year != null) {
            List<Game> games = gameRepository.findByReleaseYear(year);
            if (limit != null) {
                return games.stream().limit(limit).collect(Collectors.toList());
            }
            return games;
        }
        return gameRepository.findAll();
    }
}
