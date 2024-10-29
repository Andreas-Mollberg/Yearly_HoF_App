package com.example.Yearly_HoF_App.repositories;

import com.example.Yearly_HoF_App.models.Movie;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MovieRepository extends JpaRepository<Movie, Long> {
    List<Movie> findByReleaseYear(int releaseYear);
}
