package lk.galaxyofart.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class WebConfiguration {

    // filter chain
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {

        http.authorizeHttpRequests((auth) -> {

            // request filter
            auth

                    .requestMatchers("/css/**").permitAll()
                    .requestMatchers("/pictures/**").permitAll()
                    .requestMatchers("/bootstrap-5.2.3/**").permitAll()
                    .requestMatchers("/fontawesome-free-7.2.0/**").permitAll()
                    .requestMatchers("/js/**").permitAll()
                    .requestMatchers("/comman.css/**").permitAll()
                    .requestMatchers("/sweetalert.min.js/**").permitAll()

                    .requestMatchers("/login").permitAll()
                    .requestMatchers("/dashboard").permitAll()

                    .requestMatchers("/userprivilagebymodule/**")
                    .hasAnyAuthority("Admin", "GeneralManager", "InventoryManager", "ProductionManager",
                            "ManagmentAssistant", "cashier")

                    .requestMatchers("/employee/**").hasAnyAuthority("Admin", "GeneralManager")
                    .requestMatchers("/user/**").hasAnyAuthority("Admin", "GeneralManager")
                    .requestMatchers("/privilage/**").hasAnyAuthority("Admin", "GeneralManager")
                    .requestMatchers("/roles/**").hasAnyAuthority("Admin", "GeneralManager")

                    .requestMatchers("/artistsupplierdetails/**")
                    .hasAnyAuthority("Admin", "GeneralManager", "ManagmentAssistant")
                    .requestMatchers("/product/**", "/mugs/**", "/statues/**")
                    .hasAnyAuthority("Admin", "GeneralManager", "ManagmentAssistant", "ProductionManager", "cashier")
                    .requestMatchers("/supplierpricerequest/**").hasAnyAuthority("Admin", "GeneralManager", "ManagmentAssistant")
                    .requestMatchers("/quotation/**").hasAnyAuthority("Admin", "GeneralManager", "ManagmentAssistant")

                    .requestMatchers("/inventory/**")
                    .hasAnyAuthority("Admin", "GeneralManager", "InventoryManager", "ManagmentAssistant", "cashier")
                    .requestMatchers("/purchaseorder/**")
                    .hasAnyAuthority("Admin", "GeneralManager", "ManagmentAssistant", "cashier")
                    .requestMatchers("/grn/**").hasAnyAuthority("Admin", "GeneralManager")
                    .requestMatchers("/artistsupplierpayment/**")
                    .hasAnyAuthority("Admin", "GeneralManager", "ManagmentAssistant", "cashier")
                    .requestMatchers("/invoice/**")
                    .hasAnyAuthority("Admin", "GeneralManager", "ManagmentAssistant", "cashier")

                    .requestMatchers("/production/**").hasAnyAuthority("Admin", "GeneralManager", "ProductionManager")
                    .requestMatchers("/productionview/**")
                    .hasAnyAuthority("Admin", "GeneralManager", "ProductionManager")

                    .requestMatchers("/customerdetails/**")
                    .hasAnyAuthority("Admin", "GeneralManager", "ManagmentAssistant")
                    .requestMatchers("/reports/**")
                    .hasAnyAuthority("Admin", "GeneralManager")
                    .anyRequest().authenticated();
        })

                // login form
                .formLogin((login) -> {
                    login.loginPage("/login")
                            // .loginProcessingUrl("/login") <-- deflt prcc ekk nisa meka oni na
                            .defaultSuccessUrl("/dashboard", true)
                            .failureUrl("/login?error=usernamepassworderror")
                            .usernameParameter("username")
                            .passwordParameter("password");
                })

                // logout
                .logout((logout) -> {
                    logout.logoutUrl("/logout")
                            .clearAuthentication(true)
                            .logoutSuccessUrl("/login");
                })

                // request error handling
                .exceptionHandling((error) -> {
                    error.accessDeniedPage("/errorpage");
                });

                // CSRF stays enabled (default). Every mutating AJAX call goes through
                // getHTTPServiceRequest() in comman.js, which reads the _csrf meta tags
                // rendered by topnavbar.html and attaches the token header automatically.

        return http.build();

    }

    // password encoder
    @Bean // config ekak run weddi apita pw encoder instance ekk oni nisa bean danwa
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

}
