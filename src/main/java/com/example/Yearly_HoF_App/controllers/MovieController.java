package com.example.Yearly_HoF_App.controllers;

import com.example.Yearly_HoF_App.models.Movie;
import com.example.Yearly_HoF_App.repositories.MovieRepository;
import com.example.Yearly_HoF_App.services.MovieService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movies")
public class MovieController {

    @Autowired
    private MovieService movieService;

    @Autowired
    private MovieRepository movieRepository;

    @GetMapping
    public List<Movie> getAllMovies() {
        return movieService.getAllMovies();
    }

    @GetMapping("/{id}")
    public Movie getMovieById(@PathVariable Long id) {
        return movieService.getMovieById(id);
    }

    @PostMapping
    public Movie addMovie(@RequestBody Movie movie) {
        return movieService.addMovie(movie);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Movie> updateMovie(@PathVariable Long id, @RequestBody Movie updatedMovie) {
        Optional<Movie> movieOptional = movieRepository.findById(id);
        if (!movieOptional.isPresent()) {
            return ResponseEntity.notFound().build();
        }

        updatedMovie.setId(id);

        Movie savedMovie = movieRepository.save(updatedMovie);
        return ResponseEntity.ok(savedMovie);
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        if (!movieRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        movieRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/filter")
    public List<Movie> getMoviesByYear(@RequestParam(required = false) Integer year, @RequestParam(required = false) Integer limit) {
        if (year != null) {
            List<Movie> movies = movieRepository.findByReleaseYear(year);
            if (limit != null) {
                return movies.stream().limit(limit).collect(Collectors.toList());
            }
            return movies;
        }
        return movieRepository.findAll();
    }
}
