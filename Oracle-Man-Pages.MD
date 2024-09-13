/* Pseudocode scratch page for /Oracle Text Reader

AiD- AI Dungeon/scenario narrator AI
MPAI- Man Page AI, hypothetical chatbot for Oracle Manual Pages



function contains hasher, manager, 

*Manager reads user input into AiD and checks for /Oracle command, executing function if command detected

Example user input into AiD- "Lorem ipsum we'll make this get a real return later after the basic idea works /Oracle, how do I check my inventory?"

*If triggered, hasher parses the sentence and discards anything before "/Oracle", cuts after Oracle and sends results to Man Page AI

Example hasher output to Man Page- "how do I check my inventory?"

*Hasher outputs a placeholder input into AiD model context, replaces AID reply using onOutput with response from man Page AI (MPAI)

Example hasher output to AID- "hello"

Example AID context output in reply- "You hello to A, who responds with..."

Example response from MPAI- "To check your inventory, do XYZ..."
 
Example output from hasher to AID user, replacing AID context- "To check your inventory, do XYZ..."
   




initial function OracleInvoker-----> 





         function inputParser     onInput(text) {
                    - parse out anything before "/Oracle" in user input and save as temp object, possibly adding punctuation etc as needed
                           // syntactic sugar needed- function hash(text){} instead?
                        const hash = (text) => {
                              if (text.match(/Oracle)){ 
                                 text.trim





                                 }
                              return {text}

                           // return here is solely /Oracle input- hash.return needs to be sent to Man Page AI as input query, eg "how do I check my inventory?
                              }




                    - return "" // "hello" etc placeholder to AiD for model context construction
                    - send /Oracle temp object as pseudouser input for man page AI query
                    - take return from pseudouser input and
                        onOutput(response to placeholder) {
                            - remove AiD response to placeholder input
                            - insert man page AI query return from pseudouser input
                        }
                    }




// returning blank texts to onInput or onOutput results in errors or context-building regardless- easier to catch onOutput and replace text to user with man page return data




*/
