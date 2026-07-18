package lk.galaxyofart.services;

import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import jakarta.transaction.Transactional;
import lk.galaxyofart.User.User;
import lk.galaxyofart.User.UserRepository;
import lk.galaxyofart.privilage.Roles;

// Indicates the class is a "Service" component in the application's service layer.
@Service
public class MyUserServiceDetails implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override // Indicates that this method is overriding a method from a superclass or
              // interface.
    @Transactional // Ensures that this method runs within a database transaction.
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {

        // loged user object from database
        User logedUser = userRepository.getByUsername(username);

        if (logedUser == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }

        // Initializes a HashSet to store the GrantedAuthority objects.
        // GrantedAuthority objects represent the roles or permissions granted to the
        // user.
        Set<GrantedAuthority> authorities = new HashSet<>();

        // Iterates through the roles associated with the retrieved user
        // (extUser.getRoles()).
        // For each role, it creates a SimpleGrantedAuthority object using the role's
        // name
        // and adds it to the 'authority' set.
        for (Roles role : logedUser.getRoles()) {
            authorities.add(new SimpleGrantedAuthority(role.getName()));
        }

        // Constructs and returns a Spring Security `User` object, which is a concrete
        // implementation
        // of `UserDetails`.
        // Parameters:
        // 1. loggedUser.getUsername(): The username.
        // 2. loggedUser.getPassword(): The *hashed* password stored in the database.
        // Spring Security will
        // logged compare the provided plain-text password with this hashed password.
        // 3. loggedUser.getStatus(): Account enabled status (true/false).
        // 4. true: Account non-expired (typically true unless expiry logic is
        // implemented).
        // 5. true: Credentials non-expired (typically true unless expiry logic is
        // implemented for passwords).
        // 6. true: Account non-locked (typically true unless lockout logic is
        // implemented for failed login attempts).
        // 7. authority: The set of roles/authorities granted to the user.
        return new org.springframework.security.core.userdetails.User(logedUser.getUsername(), logedUser.getPassword(),
                logedUser.getStatus(), true, true, true, authorities);
    }

}
