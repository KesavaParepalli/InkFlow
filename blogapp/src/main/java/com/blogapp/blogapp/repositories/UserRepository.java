package com.blogapp.blogapp.repositories;


//import org.springframework.boot.webmvc.autoconfigure.WebMvcProperties.Apiversion.Use;
import org.springframework.data.jpa.repository.JpaRepository;

import com.blogapp.blogapp.entities.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
    User findByName(String name);
    User findById(long id);
}
